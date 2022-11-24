import sqlalchemy
import datetime
from db.db_session import SqlAlchemyBase, orm
from werkzeug.security import generate_password_hash, check_password_hash


class NodeModel(SqlAlchemyBase):
    __tablename__ = 'nodes'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    json_code = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    author_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id"))

    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    description = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    user = orm.relation('UserModel')
