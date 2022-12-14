from db.database import db
from db.models.project_model import ProjectModel as Project
from flask import Blueprint, Response, render_template, redirect
from flask_login import current_user, login_required
from template_projects.template_projects import PROJECT_TEMPLATE

projects_bp = Blueprint(
    "projects", __name__, template_folder="templates", static_folder="static"
)


@projects_bp.route("/new_project")
@login_required
def new_project() -> Response:
    """Create new project and redirect to the editor"""
    proj = Project(
        name="New project",
        description="A brand new project",
        user_id=current_user.id,
        json_code=PROJECT_TEMPLATE,
        img_src="noimage.png",
    )
    db.session.add(proj)
    db.session.commit()
    return redirect("/project/" + str(proj.id))


@projects_bp.route("/project")
@login_required
def projects_page() -> str:
    """Project list"""
    projects = db.session.query(Project).filter(Project.user_id == current_user.id)
    return render_template("projects.html", projects=projects)
