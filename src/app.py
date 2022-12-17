"""
This is a main module for GLSL Node Editor.
"""
import sys

from flask import Flask

from flask_assets import Environment

from db.db import init, create_db

from blueprints.editor.editor_blueprint import editor_bp
from blueprints.explore.explore_blueprint import explore_bp
from blueprints.login.login_blueprint import login_bp
from blueprints.node_api.node_api_blueprint import node_api_bp
from blueprints.nodecreate.nodecreate_blueprint import nodecreate_bp
from blueprints.nodes.nodes_blueprint import nodes_blueprint
from blueprints.previews.previews_blueprint import previews_bp
from blueprints.project_api.project_api_blueprint import projects_api_bp
from blueprints.projects.projects_blueprint import projects_bp
from blueprints.textures.textures_blueprint import textures_bp

from blueprints.login.login_blueprint import login_manager

from app_config import SQLALCHEMY_DATABASE_URI

from assets import assets


def create_app():
    app = Flask(__name__, static_url_path="/static", template_folder="templates")
    app.secret_key = (
        "NAMRsB7fTe7hnLOK38CJNYFSjWJyshioFYhsugMotfH39Y126Q36UduqPagu7HM5iulNm"
    )
    app.config["UPLOAD_FOLDER"] = "upload"
    app.config["MAX_CONTENT_PATH"] = 1024 * 1024 * 8
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI

    with app.app_context():
        init(app)

    app_env = Environment(app)
    login_manager.init_app(app)

    assets.register_bundles(app_env)
    app.register_blueprint(editor_bp)
    app.register_blueprint(explore_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(node_api_bp)
    app.register_blueprint(nodecreate_bp)
    app.register_blueprint(nodes_blueprint)
    app.register_blueprint(previews_bp)
    app.register_blueprint(projects_api_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(textures_bp)

    return app

    # If db needs to be reloaded:
    # with app.app_context():
    #     create_db()
