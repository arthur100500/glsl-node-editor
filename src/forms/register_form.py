""" Module for register form class """

from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, Length
from wtforms.fields import EmailField


class RegisterForm(FlaskForm):
    """ Form for register """
    email = EmailField('E-mail', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    password_again = PasswordField('Repeat password', validators=[DataRequired()])
    name = StringField('Nickname', validators=[DataRequired(), Length(1, 15)])
    submit = SubmitField('Register')
