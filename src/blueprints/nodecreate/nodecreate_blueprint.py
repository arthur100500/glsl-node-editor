import base64

from flask import Blueprint, Response, render_template

from flask_login import current_user

from db import db_session
from db.models.user_model import UserModel as User
from db.models.nodes_model import NodeModel as Node
from db.models.project_model import ProjectModel as Project


nodecreate_bp = Blueprint(
    "nodecreate", __name__, template_folder="templates", static_folder="static"
)


@nodecreate_bp.route("/node/<node_id>")
def node_editor_page(node_id: str) -> str:
    """Edit node page with node selected"""
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == node_id).first()
    return render_template("node-creator.html", node=node)
