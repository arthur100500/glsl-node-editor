import base64

from db.database import db
from db.models.project_model import ProjectModel as Project
from flask import Blueprint, request, Response
from flask_login import current_user

previews_bp = Blueprint(
    "previews", __name__, template_folder="templates", static_folder="static"
)


@previews_bp.route("/set_img/<int:proj_id>", methods=["POST"])
def set_img(proj_id: int) -> Response:
    """Set the preview image of a project
    Arguments:
    proj_id -- ID of the project to set the image
    also expects request.form to have img field

    Returns:
    Response with error or "success" message"""
    project = db.session.query(Project).filter(Project.id == proj_id).first()
    if not project:
        return Response("no project with id", status=404)

    if not current_user.is_authenticated:
        return Response(status=403)

    if project.user_id != current_user.id:
        return Response("project is not yours", status=403)

    if "img" not in request.form:
        return Response("id field is not present in form", status=400)

    try:
        with open(f"static/project_imgs/{proj_id}.png", "wb") as file:
            bts = request.form["img"].split(",")[1].encode("utf8")
            file.write(base64.decodebytes(bts))
        
        project.img_src = f"{proj_id}.png"
        db.session.commit()
    except Exception:
        return Response("Error saving file", status=500)

    return Response("success", status=200)
