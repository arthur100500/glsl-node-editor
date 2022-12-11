from flask import Blueprint, Response, render_template, redirect

from flask_login import (
    login_required,
    login_manager,
    logout_user,
    login_user,
    LoginManager,
)

from db import db
from db.models.user_model import UserModel as User

from forms.login_form import LoginForm
from forms.register_form import RegisterForm

login_bp = Blueprint(
    "login", __name__, template_folder="templates", static_folder="static"
)

login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id: int) -> User:
    """Load user"""
    session = db.get_session()
    return session.query(User).get(user_id)


@login_bp.route("/logout")
@login_required
def logout() -> Response:
    """Logout user"""
    logout_user()
    return redirect("/")


@login_bp.route("/login", methods=["GET", "POST"])
def login() -> str:
    """Login page"""
    login_form = LoginForm()
    register_form = RegisterForm()
    login_message = ""
    register_message = ""

    if login_form.validate_on_submit():
        session = db.get_session()
        user = session.query(User).filter(User.email == login_form.email.data).first()
        if user is None:
            login_message = "This user does not exist"
        elif not user.check_password(login_form.password.data):
            login_message = "Incorrect password"
        if user and user.check_password(login_form.password.data):
            login_user(user, remember=login_form.remember_me.data)
            return redirect("/")

    if register_form.validate_on_submit():
        session = db.get_session()
        if register_form.password.data != register_form.password_again.data:
            register_message = "Passwords are not the same"
        elif session.query(User).filter(User.email == register_form.email.data).first():
            register_message = "This email is already registered"
        elif session.query(User).filter(User.name == register_form.name.data).first():
            register_message = "This nickname is already taken"
        else:
            user = User(name=register_form.name.data, email=register_form.email.data)
            user.set_password(register_form.password.data)
            session.add(user)
            session.commit()
            return redirect("/")

    return render_template(
        "login.html",
        title="Log in/Register",
        login_form=login_form,
        register_form=register_form,
        login_message=login_message,
        register_message=register_message,
    )
