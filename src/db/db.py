""" Module for database creation """
import shutil
from pathlib import Path

from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

from app_config import DATABASE_NAME, DATABASE_BACKUP_NAME

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)


def init(app):
    db.app = app
    db.init_app(app)


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