from flask import Blueprint, Response, send_file, request

from flask_login import current_user

from db import db
from db.models.project_model import ProjectModel as Project


textures_bp = Blueprint(
    "textures", __name__, template_folder="templates", static_folder="static"
)


@textures_bp.route("/pimg/<proj_id>/<tex_id>/")
def get_proj_text_file(proj_id: str, tex_id: str) -> Response:
    """Get the texture image for project and texture unit"""
    session = db.get_session()
    project = session.query(Project).filter(Project.id == int(proj_id)).first()

    if project.user_id != current_user.id:
        return "Project is not yours"

    if not 0 <= int(tex_id) <= 7:
        return "Texture should be from 0 to 7"

    filename = "noimage.png"
    if int(tex_id) <= 4:
        filename = ["0.png", "1.png", "2.png", "3.jpg", "4.png"][int(tex_id)]

    if int(tex_id) == 0 and project.texture0_img != "":
        filename = project.texture0_img
    if int(tex_id) == 1 and project.texture1_img != "":
        filename = project.texture1_img
    if int(tex_id) == 2 and project.texture2_img != "":
        filename = project.texture2_img
    if int(tex_id) == 3 and project.texture3_img != "":
        filename = project.texture3_img
    if int(tex_id) == 4 and project.texture4_img != "":
        filename = project.texture4_img
    if int(tex_id) == 5 and project.texture5_img != "":
        filename = project.texture5_img
    if int(tex_id) == 6 and project.texture6_img != "":
        filename = project.texture6_img
    if int(tex_id) == 7 and project.texture7_img != "":
        filename = project.texture7_img

    return send_file(f"data/texture_imgs/{filename}", mimetype="image/png")


@textures_bp.route("/uploader/<proj_id>/<tex_id>/", methods=["POST"])
def upload_file(proj_id: str, tex_id: str) -> str:
    """Set the texture for project and unit specified"""
    if request.method == "POST":
        proj_id, tex_id = str(proj_id), str(tex_id)

        session = db.get_session()

        if not proj_id.isnumeric() or not tex_id.isnumeric():
            return "Project ID or Texture ID is not numeric"

        if not 0 <= int(tex_id) <= 7:
            return "Texture should be from 0 to 7"

        project = session.query(Project).filter(Project.id == int(proj_id)).first()

        file = request.files["file"]
        ext = file.filename.split(".")[-1]
        fname = f"p{proj_id}s{tex_id}.{ext}"

        if project.user_id != current_user.id:
            return "Project is not yours"

        if int(tex_id) == 0:
            project.texture0_img = fname
        if int(tex_id) == 1:
            project.texture1_img = fname
        if int(tex_id) == 2:
            project.texture2_img = fname
        if int(tex_id) == 3:
            project.texture3_img = fname
        if int(tex_id) == 4:
            project.texture4_img = fname
        if int(tex_id) == 5:
            project.texture5_img = fname
        if int(tex_id) == 6:
            project.texture6_img = fname
        if int(tex_id) == 7:
            project.texture7_img = fname

        session.add(project)
        session.commit()

        file.save(f"data/texture_imgs/{fname}")
        return "success"
    return "post method is allowed here"
