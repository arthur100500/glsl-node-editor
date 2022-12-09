from flask import render_template, Blueprint

from flask_login import current_user

from db import db_session
from db.models.user_model import UserModel as User
from db.models.nodes_model import NodeModel as Node
from db.models.project_model import ProjectModel as Project


editor_bp = Blueprint(
    "editor_page", __name__, template_folder="templates", static_folder="static"
)


@editor_bp.route("/project/<proj_id>")
def editor_page(proj_id: str) -> str:
    """Edit project page with project selected
    Arguments:
    proj_id -- ID of the project to be loaded in the editor

    Returns:
    string with html text of the editor
    """
    session = db_session.create_session()
    project = session.query(Project).filter(Project.id == int(proj_id)).first()
    author = session.query(User).filter(User.id == project.user_id).first()
    used_nodes_codes = []
    if current_user.is_authenticated:
        current_user_selected = (
            session.query(User).filter(User.id == current_user.id).first()
        )
        used_nodes_ids = str(current_user_selected.used_nodes).split()
        for node_id in used_nodes_ids:
            used_nodes_codes.append(
                session.query(Node).filter(Node.id == node_id).first().json_code
            )

    return render_template(
        "editor.html", project=project, author=author, used_nodes=used_nodes_codes
    )