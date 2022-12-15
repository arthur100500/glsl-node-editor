from db.database import db
from db.models.nodes_model import NodeModel as Node
from flask import Blueprint, Response, redirect, render_template
from flask_login import current_user, login_required
from blueprints.node_api.node_api_blueprint import add_node
from template_projects.template_projects import NODE_TEMPLATE

nodes_blueprint = Blueprint(
    "nodes", __name__, template_folder="templates", static_folder="static"
)


@nodes_blueprint.route("/new_node")
@login_required
def new_node() -> Response:
    """Create node and redirect to the editor"""
    node = Node(
        name="New node",
        json_code=NODE_TEMPLATE,
        description="A brand new node",
        author_id=current_user.id,
        owner_id=current_user.id,
        author=current_user.name,
    )
    add_node(node.id)
    db.session.add(node)
    db.session.commit()
    return redirect("/node/" + str(node.id))


@nodes_blueprint.route("/node")
@login_required
def nodes_page() -> str:
    """Node list"""
    nodes = db.session.query(Node).filter(Node.author_id == current_user.id)
    return render_template("nodes.html", nodes=nodes)
