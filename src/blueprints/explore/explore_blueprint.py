from flask import render_template, Blueprint

from db import db_session
from db.models.nodes_model import NodeModel as Node
from db.models.project_model import ProjectModel as Project


explore_bp = Blueprint(
    "explore", __name__, template_folder="templates", static_folder="static"
)


@explore_bp.route("/explore")
def explore_page() -> str:
    """Explore page: list of projects"""
    session = db_session.create_session()
    projects = session.query(Project)
    return render_template("explore.html", projects=projects)


@explore_bp.route("/explore/nodes")
def explore_page_nodes() -> str:
    """Explore page: list of nodes"""
    session = db_session.create_session()
    nodes = session.query(Node)
    return render_template("explore_nodes.html", nodes=nodes)


@explore_bp.route("/")
def index() -> str:
    """Entrypoint, redirect to explore page"""
    return explore_page()
