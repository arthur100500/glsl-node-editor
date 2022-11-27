const editor = ace.edit("editor");
editor.scale = 2;
editor.session.setMode("ace/mode/glsl");
editor.setValue(nodeCode, -1)
document.getElementById('editor').style.fontSize = '20px';
editor.resize()

