
import click
from api.models import db, User
import bcrypt
import datetime
import random
from sqlalchemy import select, and_, or_, desc

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
mock_users = ["PhoenixKing","HabitQueen","RiseUser", "PhoenixPlayer", "StreakMaster", "GoalSetter", "MindfulMona","BodyBuilderBob", "CreativeCat", "SocialButterfly", "ProductivePanda", "ZenZebra"]
length = len(mock_users) 

def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            randomName = mock_users[random.randint(0,length-1)]
            randomLevel = random.random()*10000
            existing_user = db.session.execute(select(User).where(User.name == randomName)).scalar()
            if existing_user is not None:
                insert_test_users(str(int(count)-x))
            user = User()
            user.name = randomName
            user.email = randomName + "@test.com"
            password = "test"
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

            user.password = hashed_password.decode(
                'utf-8')
            user.is_active = True
            user.last_day = datetime.datetime.now()
            user.level = randomLevel
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
