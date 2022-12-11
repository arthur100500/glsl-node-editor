from flask import Blueprint, render_template

from db import db
from db.models.nodes_model import NodeModel as Node


nodecreate_bp = Blueprint(
    "nodecreate", __name__, template_folder="templates", static_folder="static"
)


@nodecreate_bp.route("/node/<node_id>")
def node_editor_page(node_id: str) -> str:
    """Edit node page with node selected"""
    session = db.get_session()
    node = session.query(Node).filter(Node.id == node_id).first()
    return render_template("node-creator.html", node=node)
