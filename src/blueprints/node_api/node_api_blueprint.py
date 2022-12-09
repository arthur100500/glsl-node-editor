from flask import Blueprint, Response, request

from flask_login import current_user, login_required

from db import db_session
from db.models.user_model import UserModel as User
from db.models.nodes_model import NodeModel as Node


node_api_bp = Blueprint(
    "node_api", __name__, template_folder="templates", static_folder="static"
)


@node_api_bp.route("/get_code/<node_id>")
@login_required
def get_code(node_id: str) -> str:
    """Get code for a node specified"""
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return "no node"
    return node.json_code


@node_api_bp.route("/add_node/<node_id>", methods=["POST"])
@login_required
def add_node(node_id: str) -> str:
    """Add node by ID to the current user, to use in the editor later"""
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return "no node with id"

    current_user_selected = (
        session.query(User).filter(User.id == current_user.id).first()
    )
    used_nodes_set = set(str(current_user_selected.used_nodes).split())
    used_nodes_set.add(node_id)
    current_user_selected.used_nodes = " ".join(list(used_nodes_set))
    session.add(current_user_selected)
    session.commit()
    return "success"


@node_api_bp.route("/rem_node/<node_id>", methods=["POST"])
@login_required
def rem_node(node_id: str) -> str:
    """Remove node by ID to the current user, to unuse in the editor later"""
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return "no node with id"

    current_user_selected = (
        session.query(User).filter(User.id == current_user.id).first()
    )
    used_nodes_set = set(str(current_user_selected.used_nodes).split())
    used_nodes_set.remove(node_id)
    current_user_selected.used_nodes = " ".join(list(used_nodes_set))
    session.add(current_user_selected)
    session.commit()
    return "success"


@node_api_bp.route("/save_node", methods=["POST"])
def save_node() -> Response:
    """Save node"""
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(request.form["id"])).first()

    if node.author_id != current_user.id:
        return "It is not your node"

    node.name = request.form["name"]
    node.json_code = request.form["json_code"]
    session.add(node)
    session.commit()
    return "success"
