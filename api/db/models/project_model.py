""" Module for project model class """


from db.database import db
from template_projects.template_projects import PROJECT_TEMPLATE


class ProjectModel(db.Model):
    """Project model"""

    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    json_code = db.Column(db.String, nullable=True, default=PROJECT_TEMPLATE)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    name = db.Column(db.String)
    description = db.Column(db.String)
    img_src = db.Column(db.String)

    texture0_img = db.Column(db.String, default="")
    texture1_img = db.Column(db.String, default="")
    texture2_img = db.Column(db.String, default="")
    texture3_img = db.Column(db.String, default="")
    texture4_img = db.Column(db.String, default="")
    texture5_img = db.Column(db.String, default="")
    texture6_img = db.Column(db.String, default="")
    texture7_img = db.Column(db.String, default="")

    user = db.relationship("UserModel")
