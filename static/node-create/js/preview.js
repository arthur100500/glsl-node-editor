function preview() {
    let text = editor.getValue().replace(/ *\/\/([^\n]*) */g, "");
    let unifsNattribs = [];
    let lastIndex = 0
    for (let i = 0; i < text.split('\n').length; i++) {
        if (text.split('\n')[i].startsWith("uniform") || text.split('\n')[i].startsWith("attrib")) {
            unifsNattribs.push(text.split('\n')[i]);
            lastIndex = i + 1;
        }
    }
    let actualText = (text + "\n").split("\n").slice(lastIndex, -1).join("\n");

    let node = nodeFromFunctionPr(actualText, unifsNattribs);
    previewDiv.innerHTML = "";
    if (displayErrors(text)) return;
    node.draw(previewDiv)
}

const glCanvas = document.createElement("canvas");
const gl = glCanvas.getContext("webgl") || glCanvas.getContext("experimental-webgl");

function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        return info;
    }
    return "success";
}

function displayErrors(code) {
    let full = "precision mediump float;" + code + "void main(){gl_FragColor = vec4(1.0);}"
    let compRes = createShader(gl, full, gl.FRAGMENT_SHADER)
    let isCompiled = compRes === "success";
	if (isCompiled){
		compileBtn.className = "control-btn-green";
		setTimeout(() => {compileBtn.className = "control-btn";}, 200)
        return false;
	}
	else{
		compileBtn.className = "control-btn-red";
		setTimeout(() => {compileBtn.className = "control-btn";}, 200)
	}

    let errors = compRes.replaceAll("ERROR: 0:", "").trim().split("\n");
    let annotations = [];
    console.log(errors);
    for(let i = 0; i < errors.length; i++){
        annotations[i] = {
            row: Number(errors[i].split(":")[0] - 1),
            column: 0,
            text: errors[i].split(":").slice(1).join(":"),
            type: "error"
        }
    }
    editor.getSession().setAnnotations(annotations);
    return true;
}


function nodeFromFunctionPr(fnCode, additionalElems = [], additionalParams = []) {
    fnCode = fnCode.trim();
    node = new Node(false);
    node.additionElements = additionalElems;

    const regexp = /[a-zA-Z_0-9]+ [a-zA-Z_0-9\[\]]+/g;
    const array = [...fnCode.split("\n")[0].match(regexp)];

    node.name = array[0].split(" ")[1];
    node.output = new NodeOutput(node, array[0].split(" ")[0], "result", 0);

    for (let i = 1; i < array.length; i++)
        node.inputs[i - 1] = new NodeInput(node, array[i].split(" ")[0], array[i].split(" ")[1], i - 1);

    for (let i = 0; i < additionalParams.length; i++)
        node.parameters[i] = new NodeParameter(node, additionalParams[i].split(" ")[0], additionalParams[i].split(" ")[1], i);

    let header = fnCode.split("{")[0].replace(")", "") + ((array.length > 1 && additionalParams.length > 0) ? ", " : "") + additionalParams.join(", ") + "){";
    node.code = header + fnCode.split("{").slice(1).join("{");
    return node;
}

compileBtn.onclick = preview
preview()