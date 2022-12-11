from flask import Blueprint, Response, request

from flask_login import current_user, login_required

from db import db
from db.models.nodes_model import NodeModel as Node


node_api_bp = Blueprint(
    "node_api", __name__, template_folder="templates", static_folder="static"
)


@node_api_bp.route("/get_code/<node_id>")
@login_required
def get_code(node_id: str) -> str:
    """Get code for a node specified"""
    session = db.get_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return Response(status=404)
    return Response(node.json_code, status=200)


@node_api_bp.route("/add_node/<node_id>", methods=["POST"])
@login_required
def add_node(node_id: str) -> str:
    """Add node by ID to the current user, to use in the editor later"""
    session = db.get_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return Response(status=404)

    current_user.used_nodes.append(node)
    session.add(current_user)
    session.commit()
    return Response("success", status=200)


@node_api_bp.route("/rem_node/<node_id>", methods=["POST"])
@login_required
def rem_node(node_id: str) -> str:
    """Remove node by ID to the current user, to unuse in the editor later"""
    session = db.get_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return Response(status=404)

    current_user.used_nodes.remove(node)
    session.add(current_user)
    session.commit()
    return Response("success", status=200)


@node_api_bp.route("/save_node", methods=["POST"])
def save_node() -> Response:
    """Save node"""
    session = db.get_session()
    node = session.query(Node).filter(Node.id == int(request.form["id"])).first()

    if node.owner_id != current_user.id:
        return Response(status=403)

    node.name = request.form["name"]
    node.json_code = request.form["json_code"]
    session.add(node)
    session.commit()
    return Response("success", status=200)
