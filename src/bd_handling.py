""" Module to establish connection to the database """

from sqlalchemy import create_engine

engine = create_engine("sqlite:///data/db/db.sqlite")
