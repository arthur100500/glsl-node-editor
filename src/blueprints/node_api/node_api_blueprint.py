from db.database import db
from db.models.nodes_model import NodeModel as Node
from flask import Blueprint, Response, request
from flask_login import current_user, login_required

node_api_bp = Blueprint(
    "node_api", __name__, template_folder="templates", static_folder="static"
)


@node_api_bp.route("/get_code/<int:node_id>")
@login_required
def get_code(node_id: int) -> str:
    """Get code for a node specified
    Arguments:
    node_id -- ID of node to get code

    Returns:
    Response with error or responce message for ajax"""
    node = db.session.query(Node).filter(Node.id == node_id).first()
    if not node:
        return Response(status=404)

    return Response(node.json_code, status=200)


@node_api_bp.route("/add_node/<int:node_id>", methods=["POST"])
@login_required
def add_node(node_id: int) -> str:
    """Add node by ID to the current user, to use in the editor later
    Arguments:
    node_id -- ID of node to add to current_user

    Returns:
    Response with error or "success" message for ajax"""
    node = db.session.query(Node).filter(Node.id == node_id).first()
    if not node:
        return Response(status=404)

    current_user.used_nodes.append(node)
    db.session.commit()
    return Response("success", status=200)


@node_api_bp.route("/rem_node/<int:node_id>", methods=["POST"])
@login_required
def rem_node(node_id: int) -> str:
    """Remove node by ID to the current user, to unuse in the editor later
    Arguments:
    node_id -- ID of node to remove from current_user

    Returns:
    Response with error or "success" message for ajax"""
    node = db.session.query(Node).filter(Node.id == node_id).first()
    if not node:
        return Response(status=404)

    current_user.used_nodes.remove(node)
    db.session.commit()
    return Response("success", status=200)


@node_api_bp.route("/save_node", methods=["POST"])
def save_node() -> Response:
    """Save node"""
    if (
        "id" not in request.form
        and request.form["id"]
        and request.form["id"].isnumeric()
    ):
        return Response("id field is not present in form", status=400)

    if "name" not in request.form and request.form["name"]:
        return Response("name field is not present in form", status=400)

    if "json_code" not in request.form and request.form["json_code"]:
        return Response("json_code field is not present in form", status=400)

    node = db.session.query(Node).filter(Node.id == int(request.form["id"])).first()
    if not node:
        return Response("The node does not exist", status=404)

    if not current_user.is_authenticated:
        return Response("You must be logged in to save the node", status=403)

    if node.owner_id != current_user.id:
        return Response("This node is not yours", status=403)

    node.name = request.form["name"]
    node.json_code = request.form["json_code"]
    db.session.commit()
    return Response("success", status=200)
