
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task, Type_Stat, Follower
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, and_, or_, desc
from api.deepseek.chatbot import deepseek_response, stats_and_difficulty
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token, create_refresh_token
import jwt
import datetime
from flask_cors import CORS


api = Blueprint('api', __name__)
CORS(api)


# RECORDATORIO: los tokens acá NO tienen JWT_KEY, se dejan para el desarrollo final
# el JWT_KEY se debe añadir en app.py, en donde está señalado


# ----------------------------------- /register, registro de usuario
# request body
# {
#   "email":value, str
#   "password":value, str
#   "name":value, str
# }
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    print(email)
    password = str(data.get("password"))
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400
    if User.query.filter_by(name=name).first():
        return jsonify(msg="Name already in use"), 400
    salt = bcrypt.gensalt()
    name = str(data.get("name"))
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    user = User(email=email, name=name, password=hashed_password.decode(
        'utf-8'), is_active=True, last_day=datetime.datetime.now())
    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 201


# ---------------------------- maneja caducidad del streak
def streak_revision(user):
    hoy = datetime.datetime.now()
    diff = hoy - user.last_day
    if diff.days > 2:
        user.streak = 0
        db.session.commit()


# ----------------------- /login, Inicio de sesión, devuelve el token, un refresh token y el usuario
# request body
# {
#   "email":value, str
#   "password":value, str
# }
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = db.session.execute(select(User).where(
        User.email == email)).scalar()
    if user is None or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"msg": "Bad username or password"}), 401

    # ---------- crea los access y refresh tokens, recordar que NO tienen JWT_KEY aun
    streak_revision(user)
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return jsonify(token=access_token, refresh_token=refresh_token, user=user.serialize()), 200


# -------------------------------- /user/delete elimina el current user
# -------------------------------------- requiere access token
@api.route('/user/delete', methods=['DELETE'])
@jwt_required()
def handle_delete_user():
    user_id = get_jwt_identity()
    user = db.session.execute(select(User).where(User.id == user_id)).scalar()
    if user is None:
        return jsonify(msg="Usuario no válido"), 400
    tasks = db.session.execute(select(Task).where(
        Task.user_id == user_id)).scalars().all()
    for t in tasks:
        db.session.delete(t)
    db.session.delete(user)
    db.session.commit()
    return jsonify(msg="user deleted"), 200


# -------------------------- /refresh token, devuelve un nuevo access token
# --------------------------------------- requiere refresh token
@api.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def handle_refresh_token():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=str(user_id))
    return jsonify(token=access_token)


# ----------------------------------------- /profile, devuelve info del usuario
# ------------------------------------------- requiere access token
@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = db.session.execute(select(User).where(
        User.id == current_user_id)).scalar()
    if user is None:
        return jsonify({"msg": "User not found"}), 404
    streak_revision(user)
    return jsonify(user.serialize()), 200


# ------------------------------- función auxiliar para tratar con hábitos
# ----------------- devuelve True si:
# tarea.done == True
# tarea.time_to_start ya no es una fecha próxima sino una pasada
def handle_recovery_time(tarea: Task):
    if tarea.done == False:
        return True
    recovery = tarea.recovery_time

    if tarea.recovery_time is None:
        return False

    # -------------- compara el recovery_time de la task, con la fecha de hoy
    if recovery < datetime.datetime.now():
        tarea.done = False
        tarea.time_to_start = None
        db.session.commit()
        return True
    else:
        return False


# ----------------------------------- /tasks, devuelve las tareas del usuario
# --------------------------------------- requiere access token
@api.route('/tasks', methods=['GET'])
@jwt_required()
def handle_get_tasks():
    user_id = get_jwt_identity()

    # ------- saca todas las tareas del usuario
    tasks = db.session.execute(select(Task).where(
        Task.user_id == user_id)).scalars().all()
    task_list = []
    for t in tasks:
        # ------------ se ejecuta solo para actualizar los estados de task.done en caos de necesitarlo
        handle_recovery_time(t)
        task_list.append(t.serialize())
    return jsonify(task_list)


# ---------------------------------- /tasks/undone
# -------------------------- devuelve una lista con las task.done == False
# -------------------------- usa la función auxiliar handle_recovery_time para saber si se pueden hacer
# -------------------------- requiere access token
@api.route('/tasks/undone', methods=['GET'])
@jwt_required()
def handle_get_undone_tasks():
    user_id = get_jwt_identity()

    # ------- saca todas las tareas del usuario
    tasks = db.session.execute(select(Task).where(
        Task.user_id == user_id)).scalars().all()
    task_list = []
    for t in tasks:
        # ---------- solo aquellas tareas que ya se les haya pasado su recovery_time, se añaden
        if (handle_recovery_time(t)):
            task_list.append(t.serialize())
    return jsonify(msg="undone tasks", task_list=task_list), 200


# ------------------------------------------- /tasks/create
# ----------------------- crea una nueva tarea y devuelve msg de confirmación e id de la nueva task
# ---------- es necesario que el usuario introduzca los datos de una tarea, los stats, los pone chatbot
# request body, tbn requiere access token
# {
#   "description":value, str
#   "duration":value, int         --> puede ser null
#   "time_to_start":value, str    --> puede ser null
#   "habit":value, bool
#  }
@api.route('/tasks/create', methods=['POST'])
@jwt_required()
def handle_create_task():
    # --- obtengo el json que me han dado en el body de la request
    task_info = request.get_json()
    if not task_info:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # ---- devuelve un json con los valores de stats y difficulty asignados por IA
    stats_difficulty = stats_and_difficulty(task_info["description"])
    user_id = get_jwt_identity()
    new_task = Task()

    # ------- asigno las propiedades de la tarea
    new_task.user_id = user_id
    new_task.description = task_info["description"]
    new_task.duration = task_info["duration"]
    new_task.time_to_start = task_info["time_to_start"]
    new_task.habit = task_info["habit"]
    new_task.done = False

    # ------------ asigno stats y difficulty
    new_task.difficulty = stats_difficulty["difficulty"]
    new_task.body = stats_difficulty["body"]
    new_task.mind = stats_difficulty["mind"]
    new_task.productivity = stats_difficulty["productivity"]
    new_task.creativity = stats_difficulty["creativity"]
    new_task.social = stats_difficulty["social"]

    # --------------- agrego new_task a la base de datos
    db.session.add(new_task)
    db.session.commit()
    task = db.session.execute(select(Task).where(
        Task.user_id == user_id).order_by(Task.id.desc())).scalar()
    print(task.serialize())
    return jsonify(task.serialize()), 200


# ---------------------------------- /tasks/<int> es un get, devuelve una tarea en particular por su id
# ------------------------------------------- requiere access token
@api.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def handle_get_task(task_id):
    user_id = get_jwt_identity()
    get_task = db.session.execute(
        select(Task).where(Task.id == task_id)).scalar()

    # -------------------- Compruebo si la tarea existe
    if get_task == None:
        return jsonify(msg="Esa tarea no existe")

    # -------------------- Compruebo si esa tarea es de ese usuario
    if get_task.user_id == int(user_id):
        return jsonify(get_task.serialize()), 200
    return jsonify(msg="Esa tarea no es de ese usuario")


# ----------------------------- función auxiliar para tratar con hábitos
# -------------- requiere la task, modifica la propia task.done y task.time_to_start, devuelve este último
def handle_habit_done(task_done: Task):
    task_done.done = True    # --------- acá ya modifico el task.done

    # ------------------ calculo que fecha sería mañana y lo pongo en time_to_start
    tomorrow = datetime.datetime.now() + datetime.timedelta(days=1)
    task_done.recovery_time = tomorrow
    print(type(tomorrow))
    db.session.commit()
    return jsonify(msg="habit done", time_to_start=tomorrow)


# ---------------------------------- /tasks/done/<int> tarea hecha, elimina la tarea y actualiza los stats dle usuario
# ---------------------------------------------- requiere access token
@api.route('/tasks/done/<int:task_id>', methods=['POST'])
@jwt_required()
def handle_task_done(task_id):
    task_done = db.session.execute(
        select(Task).where(Task.id == task_id)).scalar()

    # ----------- revisa si el task_id es correcto
    if task_done == None:
        return jsonify(msg="la id de la tarea que diste, no existe")
    user_id = get_jwt_identity()

    # --------------- elimina la task luego de comprobar que efectivamente era de ese usuario
    if task_done.user_id == int(user_id):

        # ----------------- actualizamos los stats del usuario
        user = db.session.execute(
            select(User).where(User.id == user_id)).scalar()
        user.body = user.body + task_done.difficulty * task_done.body
        user.mind = user.mind + task_done.mind * task_done.difficulty
        user.productivity = user.productivity + \
            task_done.productivity * task_done.difficulty
        user.creativity = user.creativity + task_done.creativity * task_done.difficulty
        user.social = user.social + task_done.social * task_done.difficulty
        total_points = (task_done.difficulty + task_done.mind +
                        task_done.productivity + task_done.creativity + task_done.social) * task_done.difficulty + task_done.difficulty ** 2
        user.level = user.level + total_points

        # ------------- en caso de que sea un hábito redirijo a la función auxiliar
        # -------- esta se encarga d eponer en true task_done.done
        if task_done.habit == True:
            return handle_habit_done(task_done)

        # --------------- ya podemos eliminar la task
        db.session.delete(task_done)
        db.session.commit()
        return jsonify(msg="task done"), 200
    return jsonify(msg="bad request")


# ----------------------------- /tasks/delete/<int> elimina la tarea del int que introduzcas en la url
# ------------------------------------- requiere access token
@api.route('/tasks/delete/<int:task_id>', methods=['DELETE'])
@jwt_required()
def handle_task_delete(task_id):
    old_task = db.session.execute(
        select(Task).where(Task.id == task_id)).scalar()
    # ----------- revisa si el task_id es correcto
    if old_task == None:
        return jsonify(msg="la id de la tarea que quieres eliminar, no existe")
    user_id = get_jwt_identity()
    # --------------- elimina la task luego de comprobar que efectivamente era de ese usuario
    if old_task.user_id == int(user_id):
        db.session.delete(old_task)
        db.session.commit()
        return jsonify(msg="task deleted"), 200
    return jsonify(msg="bad request")


# --------------------------------- Devuelve lista de users a los que sigue el usuario
@api.route('/following', methods=['GET'])
@jwt_required()
def handle_get_followings():
    user_id = get_jwt_identity()
    print(user_id)
    followers = db.session.execute(select(Follower).where(
        Follower.user_that_follows_id == user_id)).scalars().all()
    result = (Follower.serialize(followers))
    print(result)
    return jsonify(result), 200


# -------------- Añade un nuevo usuario a la lista de followers, mediante la id de dicho usuario
@api.route('/following/<int:follows_id>', methods=['POST'])
@jwt_required()
def handle_add_following(follows_id):
    user_id = get_jwt_identity()
    yaEsFollower = db.session.execute(select(Follower).where(and_(
        Follower.user_that_follows_id == user_id, Follower.user_followed_id == follows_id))).scalar()
    if yaEsFollower is not None:
        return jsonify(msg="ya sigues a este usuario"), 400
    Follower().add_following(user_id, follows_id)
    return jsonify(msg="following registrado"), 200


# --------------------- Para dejar de seguir a un usuario, basta con la id del usuario
@api.route('/following/<int:follows_id>', methods=['DELETE'])
@jwt_required()
def handle_erase_following(follows_id):
    user_id = get_jwt_identity()
    yaEsFollower = db.session.execute(select(Follower).where(and_(
        Follower.user_that_follows_id == user_id, Follower.user_followed_id == follows_id))).scalar()
    if yaEsFollower is None:
        return jsonify(msg="no sigues a ese usuario"), 400
    Follower().delete_following(yaEsFollower)
    return jsonify(msg="ya no sigues a ese usuario"), 200


# --------------------------------- Devuelve lista de users a los que sigue el usuario
@api.route('/follower', methods=['GET'])
@jwt_required()
def handle_get_followers():
    user_id = get_jwt_identity()
    print(user_id)
    followers = db.session.execute(select(Follower).where(
        Follower.user_followed_id == user_id)).scalars().all()
    result = (Follower.followers(followers))
    return jsonify(result)


# --------------------- Para dejar de seguir a un usuario, basta con la id del usuario
@api.route('/follower/<int:follows_id>', methods=['DELETE'])
@jwt_required()
def handle_erase_follower(follows_id):
    user_id = get_jwt_identity()
    yaEsFollower = db.session.execute(select(Follower).where(and_(
        Follower.user_that_follows_id == follows_id, Follower.user_followed_id == user_id))).scalar()
    if yaEsFollower is None:
        return jsonify(msg="ese usuario no te sigue"), 400
    Follower().delete_following(yaEsFollower)
    return jsonify(msg="ya no te sigue ese usuario"), 200


# ------------------------- Para añadir embers
@api.route('/embers/<int:amount>', methods=['POST'])
@jwt_required()
def handle_add_embers(amount):
    user_id = get_jwt_identity()
    user = db.session.execute(select(User).where(User.id == user_id)).scalar()
    user.embers = user.embers + amount
    db.session.commit()
    return jsonify(msg="se añadieron los embers"), 200


# --------------------- Para gastar los embers
@api.route('/embers/gastar/<int:amount>', methods=['POST'])
@jwt_required()
def handle_gastar_embers(amount):
    user_id = get_jwt_identity()
    user = db.session.execute(select(User).where(User.id == user_id)).scalar()
    if user.embers < amount:
        return jsonify(msg="No tienes suficientes embers para esta acción"), 400
    user.embers = user.embers - amount
    new_amount = user.embers
    db.session.commit()
    return jsonify(msg="Te quedan " + str(new_amount)), 200


# -------------------------- Para aumentar el streak, no necesita nada
@api.route('/streak', methods=['POST'])
@jwt_required()
def handle_put_streak():
    user_id = get_jwt_identity()
    user = db.session.execute(select(User).where(User.id == user_id)).scalar()
    streak_revision(user)
    user.streak = user.streak + 1
    user.last_day = datetime.datetime.now()
    db.session.commit()
    return jsonify(msg="Ya se añadió un día más a su streak"), 200


# --------------------------- Solo durante el desarrollo
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------
# ------------------------------------------ get usuarios solo mientras se trabaje en el desarrollo


@api.route('/users', methods=['GET'])
def handle_get_all_users():
    users = db.session.execute(select(User)).scalars().all()
    response_body = []
    for u in users:
        response_body.append(u.serialize())
    print(response_body)
    return jsonify(response_body), 200


# ----------------------------------- obtener tareas
@api.route('/tarea', methods=['GET'])
def handle_get_all_taks():
    tasks = db.session.execute(select(Task)).scalars().all()
    task_list = []
    for t in tasks:
        task_list.append(t.serialize())
    return jsonify(task_list), 200


@api.route('/delete/<int:user_id>', methods=['DELETE'])
def handle_delete_user_admin(user_id):
    user = db.session.execute(select(User).where(User.id == user_id)).scalar()
    if user is None:
        return jsonify(msg="ese usuario no existe"), 400
    tasks_list = db.session.execute(select(Task).where(
        Task.user_id == user_id)).scalars().all()
    for t in tasks_list:
        db.session.delete(t)
    db.session.delete(user)
    db.session.commit()
    return jsonify(msg="ya se elimino al usuario y todas sus tareas"), 200
