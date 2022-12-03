""" Module for node model class """

import sqlalchemy
from db.db_session import SqlAlchemyBase, orm

class NodeModel(SqlAlchemyBase):
    """ Node model """
    __tablename__ = 'nodes'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    json_code = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    author_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id"))

    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    description = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    user = orm.relation('UserModel')
