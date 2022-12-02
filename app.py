import base64

from flask import Flask, render_template, redirect, request, send_file
from flask_login import LoginManager, login_user, login_required, logout_user, current_user

from forms.login_form import LoginForm
from forms.register_form import RegisterForm
from PIL import Image

from db import db_session
from db.models.user_model import UserModel as User
from db.models.nodes_model import NodeModel as Node
from db.models.project_model import ProjectModel as Project

from template_projects.template_projects import NODE_TEMPLATE, PROJECT_TEMPLATE

app = Flask(__name__, static_url_path='/static', template_folder='templates')
app.secret_key = "NAMRsB7fTe7hnLOK38CJNYFSjWJyshioFYhsugMotfH39Y126Q36UduqPagu7HM5iulNm"
app.config['UPLOAD_FOLDER'] = "upload"
app.config['MAX_CONTENT_PATH'] = 1024 * 1024 * 8

db_session.global_init("users.sqlite")


login_manager = LoginManager()
login_manager.init_app(app)


@app.route('/pimg/<proj_id>/<tex_id>/')
def get_proj_text_file(proj_id, tex_id):
    session = db_session.create_session()
    project = session.query(Project).filter(Project.id == int(proj_id)).first()
    
    if (project.user_id != current_user.id):
        return "Project is not yours"

    if (not 0 <= int(tex_id) <= 7):
        return "Texture should be from 0 to 7"

    filename = "noimage.png"
    if (int(tex_id) <=4):
        filename = ["0.png", "1.png", "2.png", "3.jpg", "4.png"][int(tex_id)] 

    if (int(tex_id) == 0 and project.texture0_img != ""): filename = project.texture0_img 
    if (int(tex_id) == 1 and project.texture1_img != ""): filename = project.texture1_img 
    if (int(tex_id) == 2 and project.texture2_img != ""): filename = project.texture2_img
    if (int(tex_id) == 3 and project.texture3_img != ""): filename = project.texture3_img
    if (int(tex_id) == 4 and project.texture4_img != ""): filename = project.texture4_img
    if (int(tex_id) == 5 and project.texture5_img != ""): filename = project.texture5_img
    if (int(tex_id) == 6 and project.texture6_img != ""): filename = project.texture6_img
    if (int(tex_id) == 7 and project.texture7_img != ""): filename = project.texture7_img

    return send_file(f"data/texture_imgs/{filename}", mimetype='image/png')


@app.route('/uploader/<proj_id>/<tex_id>/', methods = ['POST'])
def upload_file(proj_id, tex_id):
    if request.method == 'POST':
        proj_id, tex_id = str(proj_id), str(tex_id)

        session = db_session.create_session()

        if (not proj_id.isnumeric() or not tex_id.isnumeric()):
            return "Project ID or Texture ID is not numeric"

        if (not 0 <= int(tex_id) <= 7):
            return "Texture should be from 0 to 7"

        project = session.query(Project).filter(Project.id == int(proj_id)).first()
        
        f = request.files['file']
        ext = f.filename.split(".")[-1]
        fname = f"p{proj_id}s{tex_id}.{ext}"
        
        if (project.user_id != current_user.id):
            return "Project is not yours"

        if (int(tex_id) == 0): project.texture0_img = fname
        if (int(tex_id) == 1): project.texture1_img = fname
        if (int(tex_id) == 2): project.texture2_img = fname
        if (int(tex_id) == 3): project.texture3_img = fname
        if (int(tex_id) == 4): project.texture4_img = fname
        if (int(tex_id) == 5): project.texture5_img = fname
        if (int(tex_id) == 6): project.texture6_img = fname
        if (int(tex_id) == 7): project.texture7_img = fname

        session.add(project)
        session.commit()
        
        f.save(f"data/texture_imgs/{fname}")
        return 'success'


@app.route('/set_img/<proj_id>', methods=['POST'])
def set_img(proj_id):
    session = db_session.create_session()
    project = session.query(Project).filter(Project.id == int(proj_id)).first()
    if not project:
        return "no project with id"

    if project.user_id != current_user.id:
        return "success"

    with open(f"static/project_imgs/{proj_id}.png", "wb") as fh:
        bts = request.form['img'].split(',')[1].encode("utf8")
        fh.write(base64.decodebytes(bts))

    project.img_src = f"{proj_id}.png"
    session.add(project)
    session.commit()

    return "success"


@app.route('/get_code/<node_id>')
@login_required
def get_code(node_id):
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return "no node"
    return node.json_code


@app.route('/add_node/<node_id>', methods=['POST'])
@login_required
def add_node(node_id):
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return "no node with id"

    cu = session.query(User).filter(User.id == current_user.id).first()
    used_nodes_set = set(str(cu.used_nodes).split())
    used_nodes_set.add(node_id)
    cu.used_nodes = " ".join(list(used_nodes_set))
    session.add(cu)
    session.commit()
    return "success"


@app.route('/rem_node/<node_id>', methods=['POST'])
@login_required
def rem_node(node_id):
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(node_id)).first()
    if not node:
        return "no node with id"

    cu = session.query(User).filter(User.id == current_user.id).first()
    used_nodes_set = set(str(cu.used_nodes).split())
    used_nodes_set.remove(node_id)
    cu.used_nodes = " ".join(list(used_nodes_set))
    session.add(cu)
    session.commit()
    return "success"


@app.route('/new_node')
@login_required
def new_node():
    session = db_session.create_session()
    node = Node(
        name="New node",
        json_code=NODE_TEMPLATE,
        description="A brand new node",
        author_id=current_user.id
    )
    session.add(node)
    session.commit()
    return redirect("/node/" + str(node.id))


@app.route('/save_project', methods=['POST'])
def save_project():
    session = db_session.create_session()
    proj = session.query(Project).filter(Project.id == int(request.form['id'])).first()

    if proj.user_id != current_user.id:
        return "It is not your project"

    proj.name = request.form['name']
    proj.json_code = request.form['json_code']
    proj.description = request.form['desc']
    session.add(proj)
    session.commit()
    return "success"


@app.route('/save_node', methods=['POST'])
def save_node():
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == int(request.form['id'])).first()

    if node.author_id != current_user.id:
        return "It is not your node"

    node.name = request.form['name']
    node.json_code = request.form['json_code']
    session.add(node)
    session.commit()
    return "success"


@app.route('/new_project')
@login_required
def new_project():
    session = db_session.create_session()
    proj = Project(
        name="New project",
        json_code=PROJECT_TEMPLATE,
        description="A brand new project",
        user_id=current_user.id,
        img_src="noimage.png"
    )
    session.add(proj)
    session.commit()
    return redirect("/project/" + str(proj.id))


@app.route('/project/<proj_id>')
def editor_page(proj_id):
    session = db_session.create_session()
    project = session.query(Project).filter(Project.id == proj_id).first()
    author = session.query(User).filter(User.id == project.user_id).first()
    used_nodes_codes = []
    if current_user.is_authenticated:
        cu = session.query(User).filter(User.id == current_user.id).first()
        used_nodes_ids = str(cu.used_nodes).split()
        for node_id in used_nodes_ids:
            used_nodes_codes.append(session.query(Node).filter(Node.id == node_id).first().json_code)

    return render_template("editor.html", project=project, author=author, used_nodes=used_nodes_codes)


@app.route('/project')
@login_required
def projects_page():
    session = db_session.create_session()
    projects = session.query(Project).filter(Project.user_id == current_user.id)
    return render_template("projects.html", projects=projects)


@app.route('/node/<node_id>')
def node_editor_page(node_id):
    session = db_session.create_session()
    node = session.query(Node).filter(Node.id == node_id).first()
    return render_template("node-creator.html", node=node)


@app.route('/node')
@login_required
def nodes_page():
    session = db_session.create_session()
    nodes = session.query(Node).filter(Node.author_id == current_user.id)
    return render_template("nodes.html", nodes=nodes)


@app.route('/explore')
def explore_page():
    session = db_session.create_session()
    projects = session.query(Project)
    return render_template("explore.html", projects=projects)


@app.route('/explore/nodes')
def explore_page_nodes():
    session = db_session.create_session()
    nodes = session.query(Node)
    return render_template("explore_nodes.html", nodes=nodes)


@app.route('/')
def index():
    return explore_page()


@app.route('/profile/<user_id>')
def profile_page(user_id):
    return 'Profile page for ' + str(user_id)


@login_manager.user_loader
def load_user(user_id):
    session = db_session.create_session()
    return session.query(User).get(user_id)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


@app.route('/login', methods=['GET', 'POST'])
def login():
    login_form = LoginForm()
    register_form = RegisterForm()
    login_message = ""
    register_message = ""

    if login_form.validate_on_submit():
        session = db_session.create_session()
        user = session.query(User).filter(User.email == login_form.email.data).first()
        if user is None:
            login_message = "This user does not exist"
        elif not user.check_password(login_form.password.data):
            login_message = "Incorrect password"
        if user and user.check_password(login_form.password.data):
            login_user(user, remember=login_form.remember_me.data)
            return redirect("/")

    if register_form.validate_on_submit():
        session = db_session.create_session()
        if register_form.password.data != register_form.password_again.data:
            register_message = "Passwords are not the same"
        elif session.query(User).filter(User.email == register_form.email.data).first():
            register_message = "This email is already registered"
        elif session.query(User).filter(User.name == register_form.name.data).first():
            register_message = "This nickname is already taken"
        else:
            user = User(
                name=register_form.name.data,
                email=register_form.email.data
            )
            user.set_password(register_form.password.data)
            session.add(user)
            session.commit()
            return redirect('/')

    return render_template('login.html', title='Log in/Register', login_form=login_form, register_form=register_form,
                           login_message=login_message, register_message=register_message)


if __name__ == '__main__':
    app.run()
