import base64

from flask import Blueprint, Response, send_file, request

from flask_login import current_user

from db import db_session
from db.models.user_model import UserModel as User
from db.models.nodes_model import NodeModel as Node
from db.models.project_model import ProjectModel as Project


previews_bp = Blueprint(
    "previews", __name__, template_folder="templates", static_folder="static"
)


@previews_bp.route("/set_img/<proj_id>", methods=["POST"])
def set_img(proj_id: str) -> str:
    """Set the preview image of a project"""
    session = db_session.create_session()
    project = session.query(Project).filter(Project.id == int(proj_id)).first()
    if not project:
        return "no project with id"

    if project.user_id != current_user.id:
        return "success"

    with open(f"static/project_imgs/{proj_id}.png", "wb") as file:
        bts = request.form["img"].split(",")[1].encode("utf8")
        file.write(base64.decodebytes(bts))

    project.img_src = f"{proj_id}.png"
    session.add(project)
    session.commit()

    return "success"
