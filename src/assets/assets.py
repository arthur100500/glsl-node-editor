from flask_assets import Bundle


editor_js_path = "editor/js/"

editor_bundle = Bundle(
    f"{editor_js_path}/elements/elements.js",
    f"{editor_js_path}/editor/editor.js",
    f"{editor_js_path}/nodes/colors.js",
    f"{editor_js_path}/nodes/headerbg.js",
    f"{editor_js_path}/nodes/node.js",
    f"{editor_js_path}/nodes/rectbg.js",
    f"{editor_js_path}/nodes/nodeinput.js",
    f"{editor_js_path}/nodes/nodeoutput.js",
    f"{editor_js_path}/nodes/nodeparameter.js",
    f"{editor_js_path}/nodes/nodefactory.js",
    f"{editor_js_path}/ajax/save.js",
    f"{editor_js_path}/ajax/texturechange.js",
    f"{editor_js_path}/assemble/assemble.js",
    f"{editor_js_path}/connectable/connectable.js",
    f"{editor_js_path}/contextmenu/contextmenu.js",
    f"{editor_js_path}/debugger/textures.js",
    f"{editor_js_path}/debugger/debugger.js",
    f"{editor_js_path}/defaultnodes/defaultnodes.js",
    f"{editor_js_path}/draggable/draggable.js",
    f"{editor_js_path}/graphics/bezierconnector.js",
    f"{editor_js_path}/graphics/redrawer.js",
    f"{editor_js_path}/loader/projectloader.js",
    f"{editor_js_path}/zoom/zoom.js",
    f"{editor_js_path}/resize/resize.js",
    f"{editor_js_path}/sort/sort.js",
    output="editor/js/generated/main.js",
)


node_create_bundle = Bundle(
    "node-create/js/utils.js",
    "editor/js/nodes/colors.js",
    "editor/js/nodes/headerbg.js",
    "editor/js/nodes/node.js",
    "editor/js/nodes/rectbg.js",
    "editor/js/nodes/nodeinput.js",
    "editor/js/nodes/nodeoutput.js",
    "editor/js/nodes/nodeparameter.js",
    "editor/js/nodes/nodefactory.js",
    "node-create/js/main.js",
    "node-create/js/preview.js",
    "node-create/js/save.js",
    filters="jsmin",
    output="node-create/js/generated/main.js",
)


def register_bundles(app_env):
    """Registers all bundles, currently for node_create and editor.

    Arguments:
    app_env -- environment to register blueprints in. Can be got as Environment(app)
    """
    app_env.register("node_create_js", node_create_bundle)
    app_env.register("editor_js", editor_bundle)
