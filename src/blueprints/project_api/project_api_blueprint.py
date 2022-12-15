from db.database import db
from db.models.project_model import ProjectModel as Project
from flask import Blueprint, Response, request
from flask_login import current_user

projects_api_bp = Blueprint(
    "projects_api", __name__, template_folder="templates", static_folder="static"
)


@projects_api_bp.route("/save_project", methods=["POST"])
def save_project() -> Response:
    """Save project"""
    proj = (
        db.session.query(Project).filter(Project.id == int(request.form["id"])).first()
    )
    if not proj:
        return Response("Project does not exist", status=404)

    if not current_user.is_authenticated:
        return Response("You need to be logged in to save the project", status=403)

    if proj.user_id != current_user.id:
        return Response("The project is not yours", status=403)

    if "name" not in request.form:
        Response("name field is not present in form", status=400)

    if "json_code" not in request.form:
        Response("json_code field is not present in form", status=400)

    if "desc" not in request.form:
        Response("desc field is not present in form", status=400)

    proj.json_code = request.form["json_code"]
    proj.description = request.form["desc"]
    proj.name = request.form["name"]

    if not proj.json_code:
        Response("json_code field is empty", status=400)

    db.session.commit()
    return Response("success", status=200)
