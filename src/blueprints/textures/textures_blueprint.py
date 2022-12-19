import os

from db.database import db
from db.models.project_model import ProjectModel as Project
from flask import Blueprint, Response, send_file, request
from flask_login import current_user

textures_bp = Blueprint(
    "textures", __name__, template_folder="templates", static_folder="static"
)


@textures_bp.route("/pimg/<int:proj_id>/<int:tex_id>/")
def get_proj_texture_file(proj_id: int, tex_id: int) -> Response:
    """Get the texture image for project and texture unit
    Arguments:
    proj_id -- ID of the project to search for texture
    tex_id -- ID of the texture unit to be changed [0-7]

    Returns:
    Response with error or texture file (image/png)"""
    project = db.session.query(Project).filter(Project.id == proj_id).first()
    if not project:
        return Response("Project does not exist", status=404)

    if not 0 <= tex_id <= 7:
        return Response("Texture should be from 0 to 7", status=400)

    filename = "noimage.png"
    if tex_id <= 4:
        filename = ["0.png", "1.png", "2.png", "3.jpg", "4.png"][tex_id]

    field = f"texture{tex_id}_img"

    if getattr(project, field) != "":
        filename = getattr(project, field)

    if not os.path.exists("data/texture_imgs"):
        os.makedirs("data/texture_imgs")

    if not os.path.exists(f"data/texture_imgs/{filename}"):
        return Response("Preview is not found", status=404)

    return send_file(f"data/texture_imgs/{filename}", mimetype="image/png")


@textures_bp.route("/uploader/<int:proj_id>/<int:tex_id>/", methods=["POST"])
def upload_file(proj_id: int, tex_id: int) -> str:
    """Set the texture for project and unit specified
    Arguments:
    proj_id -- ID of the project to save texture for
    tex_id -- ID of the texture unit to be changed [0-7]

    Returns:
    Response with error or "success" for ajax"""
    if not 0 <= tex_id <= 7:
        return Response("Texture should be from 0 to 7", status=400)

    project = db.session.query(Project).filter(Project.id == int(proj_id)).first()
    if not project:
        return Response("Project does not exist", status=404)

    if not "file" in request.files:
        return Response("file field is not present in form", status=400)

    file = request.files["file"]
    if len(file.filename.split(".")) <= 2:
        return Response("file does not have an extension", status=400)

    ext = file.filename.split(".")[-1]
    filename = f"p{proj_id}s{tex_id}.{ext}"

    if project.user_id != current_user.id:
        return Response("Project is not yours", status=403)

    field = f"texture{tex_id}_img"

    try:
        file.save(f"data/texture_imgs/{filename}")
    except Exception:
        return Response("Error saving file", status=500)

    setattr(project, field, filename)
    db.session.commit()

    return Response("success", status=200)
