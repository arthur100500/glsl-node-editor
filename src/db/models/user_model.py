""" Module for user model class """

import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from db.db import db


association_table = db.Table('association', db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('node_id', db.Integer, db.ForeignKey('nodes.id'))
)


class UserModel(db.Model, UserMixin):
    """User model"""

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(15), unique=True)
    email = db.Column(db.String, unique=True)
    hashed_password = db.Column(db.String)
    create_date = db.Column(db.DateTime, default=datetime.datetime.now)

    used_nodes = db.relationship("NodeModel", secondary=association_table, back_populates="user")

    nodes = db.relationship("NodeModel", back_populates="user")
    projects = db.relationship("ProjectModel", back_populates="user")

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)
