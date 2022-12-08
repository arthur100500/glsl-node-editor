""" Module for user model class """

import sqlalchemy
import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from db.db_session import SqlAlchemyBase, orm


class UserModel(SqlAlchemyBase, UserMixin):
    """User model"""

    __tablename__ = "users"
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String(15), unique=True)
    email = sqlalchemy.Column(sqlalchemy.String, unique=True)
    hashed_password = sqlalchemy.Column(sqlalchemy.String)
    create_date = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.now)
    # As I understand arrays are only supported in PostgreSQL
    used_nodes = sqlalchemy.Column(sqlalchemy.String, default="")

    nodes = orm.relation("NodeModel", back_populates="user")
    projects = orm.relation("ProjectModel", back_populates="user")

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)
