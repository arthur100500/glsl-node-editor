""" Module for project model class """

import sqlalchemy
from sqlalchemy import orm

from db.db_session import SqlAlchemyBase
from template_projects.template_projects import PROJECT_TEMPLATE

class ProjectModel(SqlAlchemyBase):
    """ Project model """
    __tablename__ = 'projects'

    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    json_code = sqlalchemy.Column(sqlalchemy.String, nullable=True, default=PROJECT_TEMPLATE)
    user_id = sqlalchemy.Column(sqlalchemy.Integer,
                                sqlalchemy.ForeignKey("users.id"))
    name = sqlalchemy.Column(sqlalchemy.String)
    description = sqlalchemy.Column(sqlalchemy.String)
    img_src = sqlalchemy.Column(sqlalchemy.String)
    
    texture0_img = sqlalchemy.Column(sqlalchemy.String, default="")
    texture1_img = sqlalchemy.Column(sqlalchemy.String, default="")
    texture2_img = sqlalchemy.Column(sqlalchemy.String, default="")
    texture3_img = sqlalchemy.Column(sqlalchemy.String, default="")
    texture4_img = sqlalchemy.Column(sqlalchemy.String, default="")
    texture5_img = sqlalchemy.Column(sqlalchemy.String, default="")
    texture6_img = sqlalchemy.Column(sqlalchemy.String, default="")
    texture7_img = sqlalchemy.Column(sqlalchemy.String, default="")

    user = orm.relation('UserModel')
