from flask import Blueprint, Response, request

from flask_login import current_user

from db import db
from db.models.project_model import ProjectModel as Project


projects_api_bp = Blueprint(
    "projects_api", __name__, template_folder="templates", static_folder="static"
)


@projects_api_bp.route("/save_project", methods=["POST"])
def save_project() -> Response:
    """Save project"""
    session = db.get_session()
    proj = session.query(Project).filter(Project.id == int(request.form["id"])).first()

    if proj.user_id != current_user.id:
        return Response("The project is not yours", status=403)

    proj.name = request.form["name"]
    proj.json_code = request.form["json_code"]
    proj.description = request.form["desc"]
    session.add(proj)
    session.commit()
    return Response("success", status=200)
