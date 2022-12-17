""" Module for database creation """
import shutil
from pathlib import Path

from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa

from app_config import DATABASE_NAME, DATABASE_BACKUP_NAME
from sqlalchemy_utils import database_exists, create_database

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)


def init(app):
    db.app = app
    db.init_app(app)

    # Create if it does not exist
    engine = db.get_engine()
    if not database_exists(engine.url):
        create_database(engine.url)

    table_names = sa.inspect(engine).get_table_names()
    if "users" not in table_names or "users" not in table_names or "users" not in table_names or "users" not in table_names:
        create_db()


def get_session():
    return db.session


def create_db():
    # Check if db file already exists. If so, backup it
    db_file = Path(DATABASE_NAME)
    if db_file.is_file():
        shutil.copyfile(DATABASE_NAME, DATABASE_BACKUP_NAME)

    # Init DB
    db.session.commit()
    db.drop_all()
    db.create_all()
