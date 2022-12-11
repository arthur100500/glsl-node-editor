""" Module for node model class """

from db.db import db


class NodeModel(db.Model):
    """Node model"""

    __tablename__ = "nodes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    json_code = db.Column(db.String, nullable=True)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    author = db.Column(db.String)
    owner_id = db.Column(db.Integer)

    name = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=True)

    user = db.relationship("UserModel")
