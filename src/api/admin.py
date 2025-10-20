
import os
from flask_admin import Admin
from .models import db, User, Task
from flask_admin.contrib.sqla import ModelView


class view_of_tasks(ModelView):
    form_columns = ['user', 'description',
                    'duration', 'time_to_start', 'habit', 'done', 'difficulty', 'body', 'mind', 'productivity', 'creativity', 'social']
    column_list = ['user', 'description',
                   'duration', 'time_to_start', 'difficulty', 'done', 'habit', 'body', 'mind', 'productivity', 'creativity', 'social']


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(view_of_tasks(Task, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
