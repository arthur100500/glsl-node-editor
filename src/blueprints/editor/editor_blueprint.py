from db.database import db
from db.models.project_model import ProjectModel as Project
from db.models.user_model import UserModel as User
from flask import render_template, Blueprint, Response
from flask_login import current_user

editor_bp = Blueprint(
    "editor_page", __name__, template_folder="templates", static_folder="static"
)


@editor_bp.route("/project/<int:proj_id>")
def editor_page(proj_id: int) -> Response:
    """Edit project page with project selected
    Arguments:
    proj_id -- ID of the project to be loaded in the editor

    Returns:
    string with html text of the editor
    """

    project = db.session.query(Project).filter(Project.id == proj_id).first()
    if not project:
        return Response("Project does not exist", 404)

    author = db.session.query(User).filter(User.id == project.user_id).first()
    if not author:
        return Response("Project has no author", 404)

    used_nodes_codes = []
    if current_user.is_authenticated:
        for node in current_user.used_nodes:
            used_nodes_codes.append(node.json_code)

    return render_template(
        "editor.html", project=project, author=author, used_nodes=used_nodes_codes
    )
