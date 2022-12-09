""" Module that provides session methods """

import sqlalchemy as sa
from sqlalchemy import orm
from sqlalchemy.orm import Session
import sqlalchemy.ext.declarative as dec

SqlAlchemyBase = dec.declarative_base()

FACTORY = None


def global_init(db_file: str) -> None:
    """Init database connection"""
    global FACTORY

    if FACTORY:
        return

    if not db_file or not db_file.strip():
        raise Exception("Необходимо указать файл базы данных.")

    conn_str = f"sqlite:///{db_file.strip()}?check_same_thread=False&charset=utf8"
    print(f"Подключение к базе данных по адресу {conn_str}")

    engine = sa.create_engine(conn_str, echo=False)
    FACTORY = orm.sessionmaker(bind=engine)

    SqlAlchemyBase.metadata.create_all(engine)


def create_session() -> Session:
    """Get session"""
    global FACTORY
    return FACTORY()
