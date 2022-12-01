import sqlalchemy
from sqlalchemy import orm
from db.db_session import SqlAlchemyBase


class ProjectModel(SqlAlchemyBase):
    __tablename__ = 'projects'

    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    json_code = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer,
                                sqlalchemy.ForeignKey("users.id"))
    name = sqlalchemy.Column(sqlalchemy.String)
    description = sqlalchemy.Column(sqlalchemy.String)
    img_src = sqlalchemy.Column(sqlalchemy.String)
    
    # Textures (0-7)
    texture0_img = sqlalchemy.Column(sqlalchemy.String, default="0.png")
    texture1_img = sqlalchemy.Column(sqlalchemy.String, default="1.png")
    texture2_img = sqlalchemy.Column(sqlalchemy.String, default="2.png")
    texture3_img = sqlalchemy.Column(sqlalchemy.String, default="3.jpg")
    texture4_img = sqlalchemy.Column(sqlalchemy.String, default="4.png")
    texture5_img = sqlalchemy.Column(sqlalchemy.String, default="5.png")
    texture6_img = sqlalchemy.Column(sqlalchemy.String, default="6.png")
    texture7_img = sqlalchemy.Column(sqlalchemy.String, default="7.png")

    user = orm.relation('UserModel')
