from db.database import db
from db.models.nodes_model import NodeModel as Node
from flask import Blueprint, render_template, Response

nodecreate_bp = Blueprint(
    "nodecreate", __name__, template_folder="templates", static_folder="static"
)


@nodecreate_bp.route("/node/<int:node_id>")
def node_editor_page(node_id: int) -> Response:
    """Edit node page with node selected
    Arguments:
    node_id -- ID of node to be opened in the editor

    Returns:
    Response with error or html for editor"""

    node = db.session.query(Node).filter(Node.id == node_id).first()
    if not node:
        return Response("Node not found", status=404)

    return render_template("node-creator.html", node=node)
