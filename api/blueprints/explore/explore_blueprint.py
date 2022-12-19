from db.database import db
from db.models.nodes_model import NodeModel as Node
from db.models.project_model import ProjectModel as Project
from flask import render_template, Blueprint

explore_bp = Blueprint(
    "explore", __name__, template_folder="templates", static_folder="static"
)


@explore_bp.route("/explore")
def explore_page() -> str:
    """Explore page: list of projects"""
    projects = db.session.query(Project)
    return render_template("explore.html", projects=projects)


@explore_bp.route("/explore/nodes")
def explore_page_nodes() -> str:
    """Explore page: list of nodes"""
    nodes = db.session.query(Node)
    return render_template("explore_nodes.html", nodes=nodes)


@explore_bp.route("/")
def index() -> str:
    """Entrypoint, redirect to explore page"""
    return explore_page()
