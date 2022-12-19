const glCanvas = document.querySelector("#gl-canvas");
const mainEditorDiv = document.querySelector("#main-editor");
const contextMenu = document.querySelector("#context-menu");
const contextMenuNodes = document.querySelector("#node-list-div");

const openCloseTriangle = document.querySelector("#oc-triangle");
const pageLayoutDiv = document.querySelector("#page-layout");

const compileButton = document.querySelector("#compile-button");
const saveShButton = document.querySelector("#save-as-shader-button");
const savePrButton = document.querySelector("#save-as-project-button");
const sortPrButton = document.querySelector("#sort-button");

const prName = document.querySelector(".pr-name")
const prDesc = document.querySelector(".pr-desc")

const nodeEditorDiv = document.querySelector("#node-editor");

const usedNodesMetas = document.querySelectorAll(".used-nodes");
class Editor {
    static allNodes = [];
    static somethingIsBeingDragged = false;
    static somethingIsBeingConnected = false;
}
const nodeBgColor = "#303030";
const dragableHeaderBgColor = "#424242";

const typeColors = {
    "int": "#0022ff",
    "float": "#008822",
    "bool": "#882200",
    "vec2": "#004488",
    "vec3": "#008888",
    "vec4": "#0088ff",
    "void": "#000000",
    "sampler2D": "#888800"
};
class HeaderRectBackground {
    constructor(baseNode) {
        this.baseNode = baseNode;
    }

    getHtml() {
        let svgB = "<svg width=\"" + this.baseNode.width + "\" height=\"" + 25 + "\" xmlns=\"http://www.w3.org/2000/svg\">";
        let svgE = "</svg>";
        return svgB + "<rect x=\"0\" y=\"0\" width=" + this.baseNode.width + " height=" + 25 + " rx=\"6\" ry=\"6\" style=\"fill:" + dragableHeaderBgColor + "\"/>" + svgE;
    }
}
class Node {
    static latestNodeID = 0;
    
    constructor(functional = true) {
        // Logic
        this.name = "New node";
        this.code = "";
        this.id = Node.latestNodeID++;
        this.inputs = []
        this.output = new NodeOutput(this, "bool", "not_done", 0);
        this.additionElements = [];
        this.parameters = [];

        // Graphics and drawing	
        this.positionX = 0;
        this.positionY = 0;

        this.width = 200;
        this.height = 70 + this.inputs.length * 30;

        this.bg = new RectBackground(this);
        this.dragableHeaderbg = new HeaderRectBackground(this);

        this.nodeContainer = document.createElement('div');
        this.dragableHeader = document.createElement('div');

        this.functional = functional;
    }

    fullName() {
        "node" + this.name + this.id;
    }

    glName() {
        "node" + this.id;
    }

    recountGraphicParams() {
        if (this.output.type !== "void")
            this.height = 70 + (this.inputs.length + this.parameters.length) * 30;
        else
            this.height = 20 + (this.inputs.length + this.parameters.length) * 30;
    }

    updateContStyle() {
        this.nodeContainer.style = "position:absolute; left:" + this.positionX + "px; top:" + this.positionY + "px; height:" + this.height + "px;";
    }

    draw(target) {
        this.recountGraphicParams();

        // Container
        this.nodeContainer.className = "node-container";
        this.nodeContainer.id = "node" + this.id;
        this.updateContStyle()
        this.nodeContainer.innerHTML = this.bg.getHtml();

        // Header
        this.nodeContainer.className = "node-header";
        this.dragableHeader.id = "node" + this.id + "header";
        this.dragableHeader.style = "position:absolute; left:" + 0 + "px; top:" + 0 + "px;;";
        this.dragableHeader.innerHTML = this.dragableHeaderbg.getHtml() + "<span style=\"position:absolute; width: " + this.width + "px; left:0px; top:3px; text-align: center; font-size: 14pt;\"><b>" + this.name.replaceAll("_", " ") + "</b></span>";

        // Close button
        let nodeRemoveBtn = document.createElement("span");
        nodeRemoveBtn.className = "close";
        nodeRemoveBtn.innerHTML = "&times;";
        nodeRemoveBtn.style = "position: absolute; top: -7px; right: -5px; width: 30px;";
        nodeRemoveBtn.node = this;
        nodeRemoveBtn.onmousedown = function () { this.node.destroy(); };
        this.dragableHeader.appendChild(nodeRemoveBtn);


        this.nodeContainer.appendChild(this.dragableHeader);

        // Output
        if (this.output.type !== "void") {
            let outputDiv = document.createElement('div');
            outputDiv.className = "node-output-container";
            outputDiv.id = "node" + this.id + "output";
            outputDiv.style = "width: 20px; height:20px; display: flex; justify-content: flex-end; position:absolute; left:" + (this.width - 20) + "px; top:" + (50 + 30 * (this.inputs.length + this.parameters.length)) + "px;;";
            outputDiv.innerHTML = this.output.getHtml();
            this.nodeContainer.appendChild(outputDiv);

            // Set connectable interface
            this.output.setDivRepr(outputDiv);
            if (this.functional)
                setAbleToConnectFrom(outputDiv, this.output);
        }

        // Parameters
        for (let i = 0; i < this.parameters.length; i++) {
            let paramDiv = document.createElement('div');
            paramDiv.className = "node-input-container";
            paramDiv.id = "node" + this.id + "parameter" + this.parameters[i].id;
            paramDiv.style = "height:20px; position:absolute; left:" + 0 + "px; top:" + (30 + 30 * i + 30 * this.inputs.length) + "px;;";
            paramDiv.appendChild(this.parameters[i].getLabel());
            paramDiv.appendChild(this.parameters[i].getInput());
            this.nodeContainer.appendChild(paramDiv);
        }

        // Inputs
        for (let i = 0; i < this.inputs.length; i++) {
            let inputDiv = document.createElement('div');
            inputDiv.className = "node-input-container";
            inputDiv.id = "node" + this.id + "input" + this.inputs[i].id;
            inputDiv.style = "width: 20px; height:20px; position:absolute; left:" + 0 + "px; top:" + (30 + 30 * i) + "px;;";
            inputDiv.innerHTML = this.inputs[i].getHtml();
            this.nodeContainer.appendChild(inputDiv);

            // Set connectable interface
            this.inputs[i].setDivRepr(inputDiv);
            if (this.functional)
                setAbleToConnectTo(inputDiv, this.inputs[i]);
        }
        target.appendChild(this.nodeContainer);

        if (this.functional)
            dragElement(this.nodeContainer);
    }

    destroy() {
        // remove body
        mainEditorDiv.removeChild(this.nodeContainer);
        // remove input
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].connectedSourceVisualConnection !== null) {
                this.inputs[i].connectedSource = null;
                mainEditorDiv.removeChild(this.inputs[i].connectedSourceVisualConnection.connectorContainer);
            }
        }

        for (let i = 0; i < Editor.allNodes.length; i++) {
            for (let j = 0; j < Editor.allNodes[i].inputs.length; j++) {
                if (Editor.allNodes[i].inputs[j].connectedSource === this.output) {
                    Editor.allNodes[i].inputs[j].connectedSource = null;
                    mainEditorDiv.removeChild(Editor.allNodes[i].inputs[j].connectedSourceVisualConnection.connectorContainer);
                }
            }
        }

        Editor.allNodes.splice(Editor.allNodes.indexOf(this), 1);
    }

    toJson() {
        let nodeJson = JSON.stringify(this, ['name', 'code', 'id', 'additionElements', 'parameters', 'positionX', 'positionY', 'width', 'height']);
        let inputsJson = [];
        let paramsJson = [];
        let outputJson = this.output.toJson();
        for (let i = 0; i < this.inputs.length; i++)
            inputsJson.push(this.inputs[i].toJson());
        for (let i = 0; i < this.parameters.length; i++)
            paramsJson.push(this.parameters[i].toJson());
        return nodeJson.slice(0, -1) + ", \"inputs\": [" + inputsJson.join(", ") + "], \"parameters\": [" + paramsJson.join(", ") + "], \"output\": " + outputJson + "}";
    }
}
class RectBackground {
    constructor(baseNode) {
        this.baseNode = baseNode;
    }

    getHtml() {
        let svgB = "<svg width=\"" + this.baseNode.width + "\" height=\"" + this.baseNode.height + "\" xmlns=\"http://www.w3.org/2000/svg\">";
        let svgE = "</svg>";
        return svgB + "<rect x=\"0\" y=\"0\" width=" + this.baseNode.width + " height=" + this.baseNode.height + " rx=\"6\" ry=\"6\" style=\"fill:" + nodeBgColor + "\"/>" + svgE;
    }
}
class NodeInput {
    constructor(baseNode, dataType, inputName, id, functional = true) {
        this.divRepr = null;

        this.functional = functional;

        this.baseNode = baseNode;
        this.type = dataType;
        this.name = inputName;
        this.id = id;
        this.connectedSource = null;
        this.connectedSourceVisualConnection = null;

        this.color = typeColors[this.type];
        if (this.color === null) this.color = "#ff0000";
    }

    // Used to get exact position to render a curve
    setDivRepr(divRepr) {
        this.divRepr = divRepr;
    }

    toJson() {
        if (!this.functional) return;
        let inputJson = JSON.stringify(this, ['type', 'name', 'id']);
        let connectedSourceJson = this.connectedSource !== null ? this.connectedSource.fullName() : "null";
        return inputJson.slice(0, -1) + ", \"connectedSource\": \"" + connectedSourceJson + "\"}";
    }

    recalculateVisualConnections() {
        if (!this.functional) return;
        if (this.connectedSource === null || this.connectedSourceVisualConnection === null) return;

        let bRect = this.connectedSource.baseNode.nodeContainer.style;
        let selfBRect = this.connectedSource.divRepr.style;
        let x0 = Number(bRect.left.replace("px", "")) + Number(selfBRect.left.replace("px", ""));
        let y0 = Number(bRect.top.replace("px", "")) + Number(selfBRect.top.replace("px", ""));
        let nodeBRect = this.baseNode.nodeContainer.style;
        let sourceBRect = this.divRepr.style;
        let x1 = Number(nodeBRect.left.replace("px", "")) + Number(sourceBRect.left.replace("px", ""));
        let y1 = Number(nodeBRect.top.replace("px", "")) + Number(sourceBRect.top.replace("px", ""));

        this.connectedSourceVisualConnection.x0 = x0 + 20 / 2;
        this.connectedSourceVisualConnection.x1 = x1 + 20 / 2;
        this.connectedSourceVisualConnection.y0 = y0 + 20 / 2;
        this.connectedSourceVisualConnection.y1 = y1 + 20 / 2;

        mainEditorDiv.appendChild(this.connectedSourceVisualConnection.genElement());
    }

    connectSource(source) {
        if (!this.functional) return;
        // Check if new connection is typed right
        if (source.type !== this.type) return;

        // Remove old connection
        if (this.connectedSource !== null)
            mainEditorDiv.removeChild(this.connectedSourceVisualConnection.genElement());

        let bRect = source.divRepr.getBoundingClientRect();
        let selfBRect = this.divRepr.getBoundingClientRect();

        this.connectedSourceVisualConnection = new BezierConnector(
            bRect.x + bRect.width / 2,
            bRect.y + bRect.height / 2,
            selfBRect.x + selfBRect.width / 2,
            selfBRect.y + selfBRect.height / 2,
            source.color
        );

        mainEditorDiv.appendChild(this.connectedSourceVisualConnection.genElement());
        this.connectedSource = source;
    }

    getHtml() {
        // Circle
        let svgB = "<svg style=\"position: absolute; left: 0; top:0;\" width=\"" + 20 + "\" height=\"" + 20 + "\" xmlns=\"http://www.w3.org/2000/svg\">";
        let svgE = "</svg>";
        let fullSvg = svgB + "<circle cx=\"10\" cy=\"10\" r=\"7\" />" + svgE;

        // Circle 2
        svgB = "<svg style=\"position: absolute; left: 0; top:0;\" width=\"" + 20 + "\" height=\"" + 20 + "\" xmlns=\"http://www.w3.org/2000/svg\">";
        svgE = "</svg>";
        fullSvg += svgB + "<circle cx=\"10\" cy=\"10\" r=\"5\" style=\"fill:" + this.color + "\"/>" + svgE;

        // Name
        let name = "<span style=\"position:absolute; left:20px; top:0px;font-size: 14pt;\">" + this.name + "(" + this.type + ")" + "</span>";

        return fullSvg + name;
    }

    fullName() {
        return "node" + this.baseNode.id + "input" + this.id;
    }
}

class NodeOutput {
    constructor(baseNode, dataType, outputName, id, functional = true) {
        this.divRepr = null;

        this.functional = functional;
        this.baseNode = baseNode;
        this.type = dataType;
        this.name = outputName;
        this.id = id;

        this.color = typeColors[this.type];
        if (this.color == null) this.color = "#ff0000";
    }

    toJson() {
        if (!this.functional) return;
        return JSON.stringify(this, ['type', 'name', 'id']);
    }

    // Used to get exact position to render a curve
    setDivRepr(divRepr) {
        this.divRepr = divRepr;
    }


    getHtml() {
        // Circle
        let svgB = "<svg style=\"position: absolute; left: 0; top:0;\" width=\"" + 20 + "\" height=\"" + 20 + "\" xmlns=\"http://www.w3.org/2000/svg\">";
        let svgE = "</svg>";
        let fullSvg = svgB + "<circle cx=\"10\" cy=\"10\" r=\"7\" />" + svgE;

        // Circle 2
        svgB = "<svg style=\"position: absolute; left: 0; top:0;\" width=\"" + 20 + "\" height=\"" + 20 + "\" xmlns=\"http://www.w3.org/2000/svg\">";
        svgE = "</svg>";
        fullSvg += svgB + "<circle cx=\"10\" cy=\"10\" r=\"5\" style=\"fill:" + this.color + "\"/>" + svgE;

        // Name
        let name = "<span style=\"position:absolute; right:20px; top:0px;font-size: 14pt;\">" + this.name + "(" + this.type + ")" + "</span>";

        return name + fullSvg;
    }

    fullName() {
        return "node" + this.baseNode.id + "output" + this.id;
    }
}
class NodeParameter {
    constructor(baseNode, dataType, name, id) {
        this.baseNode = baseNode;
        this.type = dataType;
        this.name = name;
        this.id = id;

        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.className = "parameter-input";
        this.inputField.id = this.getFullName();
        this.inputField.name = this.getFullName() + "name";
    }

    set value(val) {
        this.inputField.value = val;
    }

    get value() {
        return this.getValue();
    }

    getValue() {
        return this.inputField.value;
    }

    getFullName() {
        return "param" + this.baseNode.name + this.baseNode.id + this.name + this.id;
    }

    getInput() {
        return this.inputField;
    }

    getLabel() {
        let lbl = document.createElement("span");
        lbl.style = "font-size: 14pt; margin-left:3px;";
        lbl.innerHTML = this.name + ": ";
        return lbl;
    }

    toJson() {
        return JSON.stringify(this, ['type', 'name', 'id', 'value']);
    }
}

class NodeFactory {
    nodeFromFunction(fnCode, additionalElems = [], additionalParams = []) {
        fnCode = fnCode.trim();
        let node = new Node();
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

    nodeFromJson(code) {
        let newNode = new Node();
        newNode.name = code.name;
        newNode.code = code.code;
        newNode.additionElements = code.additionElements;
        newNode.height = code.height;
        newNode.width = code.width;
        newNode.positionX = code.positionX;
        newNode.positionY = code.positionY;
        newNode.id = code.id;
        newNode.parameters = [];
        newNode.inputs = [];
        Node.latestNodeID = Math.max(Node.latestNodeID, newNode.id + 1);

        return newNode;
    }
}
const savenotify = () => $.notify("Saved code", "success", {
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 1000,
    className: "save-note"
});


const errornotify = (msg) => $.notify(msg, "error", {
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 1000,
    className: "save-note"
});


savePrButton.onmousedown = function () {
    let code = "";
    for (let i = 0; i < Editor.allNodes.length; i++)
        code += Editor.allNodes[i].toJson() + ", ";
    code = "[" + code.slice(0, -2) + "]"

    let pname = prName.innerHTML;
    let pdesc = prDesc.innerHTML;

    let pid = document.querySelector("#project-id").dataset.projectId

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/save_project',
        data: { name: pname, desc: pdesc, json_code: code, id: pid },
        success: function (response) {
            if (!(response === "success")) {
        errornotify(response);
            }
            else
                savenotify();
        },
    error: function (err) {
            if (err.responseText === "success")
                savenotify();
            else
                errornotify(err.responseText);
        }
    });

    $.ajax({
        type: 'POST',
        dataType: 'data',
        url: '/set_img/' + pid,
        data: { img: glCanvas.toDataURL() },
        success: function (_) {

        },
        error: function (_) {

        }
    });
}

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        savePrButton.onmousedown();
    }
});
changedSucc = () => $.notify("Changed successfully, refresh the page", "success", {
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 1000,
    className: "save-note"
});

const changeTextureImage = (obj) => {
    let myFormData = new FormData();
    myFormData.append('file', obj.files[0]);

    $.ajax({
        type: 'POST',
        dataType: false,
        url: obj.attributes.addr.value,
        data: myFormData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (!(response === "success")) {
                console.log(response);
            }
            else {
                changedSucc();
            }
        },
        error: function (error) {
            if (error.status === 200)
                changedSucc();
        }
    });
}
// Assembles GLSL Shader from node list
const assamble = (allNodes) => {
    let allNodesDefined = [];
    let shaderHeader = `
precision mediump float;

`;

    function removeRedefenitions(statements) {
        statementsArr = statements.split("\n");
        resultingDefenitions = [];
        usedDefenitions = [];
        for (let i = 0; i < statementsArr.length; i++) {
            if (!usedDefenitions.includes(statementsArr[i].split(" ").slice(0, 3).join(" "))) {
                resultingDefenitions.push(statementsArr[i]);
            }
            usedDefenitions.push(statementsArr[i].split(" ").slice(0, 3).join(" "));
        }

        return resultingDefenitions.join("\n");
    }

    let allAdditionalElements = [];

    for (let i = 0; i < allNodes.length; i++)
        for (let j = 0; j < allNodes[i].additionElements.length; j++)
            allAdditionalElements.push(allNodes[i].additionElements[j]);

    allAdditionalElements = removeRedefenitions(allAdditionalElements.join("\n"))

    let outputNodes = [];
    let code = shaderHeader + allAdditionalElements + "\n\n\n";

    // Build all functions
    for (let i = 0; i < allNodes.length; i++) {
        if (!allNodesDefined.includes(allNodes[i].code.replace("(", " ").split(" ")[1]))
            code += allNodes[i].code + "\n\n";
        allNodesDefined.push(allNodes[i].code.replace("(", " ").split(" ")[1]);
    }

    // Take output nodes
    for (let i = 0; i < allNodes.length; i++)
        if (allNodes[i].output.type === "void")
            outputNodes.push(allNodes[i]);


    function assambleCode(node) {
        nCode = "";
        for (let i = 0; i < node.inputs.length; i++)
            if (node.inputs[i].connectedSource != null)
                nCode += assambleCode(node.inputs[i].connectedSource.baseNode);

        let fnInputs = "";

        for (let i = 0; i < node.inputs.length; i++)
            if (node.inputs[i].connectedSource != null)
                fnInputs += node.inputs[i].connectedSource.baseNode.name + node.inputs[i].connectedSource.baseNode.id + ", ";

        for (let i = 0; i < node.parameters.length; i++)
            fnInputs += node.parameters[i].value + ", ";

        fnInputs = fnInputs.slice(0, -2);

        //Node name is function signature??? Make sure later
        if (node.output.type === "void")
            nCode += "\t" + node.name + "(" + fnInputs + ");\n";
        else
            nCode += "\t" + node.output.type + " " + node.name + node.id + " = " + node.name + "(" + fnInputs + ");\n\n";
        return nCode;
    }

    code += "void main(){\n";
    for (let i = 0; i < outputNodes.length; i++)
        code += removeRedefenitions(assambleCode(outputNodes[i]));
    code += "\n}";

    return code;
}

compileButton.onmousedown = () => {
    code = assamble(Editor.allNodes);
    fragShader = code;
    draw(glCanvas);
}
let current = null;
let lastConnectionSource = null;
let mouseY = 0;
let mouseX = 0;
// onmouseup не работал так что я ввел костыль
let destinationElements = []

// Source is ment to be NodeOutput
function setAbleToConnectFrom(elem, source) {
    elem.onmousedown = function () {
        let nodeBRect = source.baseNode.nodeContainer.style;
        let sourceBRect = elem.style;

        let x = Number(nodeBRect.left.replace("px", "")) + Number(sourceBRect.left.replace("px", ""));
        let y = Number(nodeBRect.top.replace("px", "")) + Number(sourceBRect.top.replace("px", ""));

        current = new BezierConnector(x + 20 / 2, y + 20 / 2, 0, 0, source.color);
        Editor.somethingIsBeingConnected = true;
        lastConnectionSource = source;
    };
}

function setAbleToConnectTo(elem, destination) {
    destinationElements.push([elem, destination]);
}

window.onmousemove = function (mEvent) {
    mouseX = mEvent.clientX;
    mouseY = mEvent.clientY;
    if (current === null) return;
    let xOff = nodeEditorDiv.getBoundingClientRect().left;
    let yOff = nodeEditorDiv.getBoundingClientRect().top;
    current.x1 = (mouseX - getMatrix()[4] + getScrollLeft() - xOff) / getMatrix()[0];
    current.y1 = (mouseY - getMatrix()[5] + getScrollTop() - yOff) / getMatrix()[3];
    mainEditorDiv.appendChild(current.genElement());
}

window.onmouseup = function (mEvent) {
    if (current === null) return;
    // Handle connections
    for (let i = 0; i < destinationElements.length; i++) {
        let bRect = destinationElements[i][0].getBoundingClientRect();
        if (mouseX < bRect.x + bRect.width && mouseX > bRect.x && mouseY < bRect.y + bRect.height && mouseY > bRect.y)
            destinationElements[i][1].connectSource(lastConnectionSource);
    }

    // Remove connection if mouse is up 
    let unusedConnector = document.querySelector("#connector" + current.id);
    mainEditorDiv.removeChild(unusedConnector);

    // To avoid conflicts if it actually should work
    lastConnectionSource = null;
    current = null;
    Editor.somethingIsBeingConnected = false;
}

const scope = document.querySelector("body");

const normalizePozition = (cmMenuX, cmMenuY) => {
    let {
        left: scopeOffsetX,
        top: scopeOffsetY,
    } = scope.getBoundingClientRect();

    scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
    scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;

    let normalizedX = cmMenuX;
    let normalizedY = cmMenuY;

    return { normalizedX, normalizedY };
};

scope.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const { clientX: cmMenuX, clientY: cmMenuY } = event;

    const { normalizedX, normalizedY } = normalizePozition(cmMenuX, cmMenuY);

    contextMenu.classList.remove("visible");

    contextMenu.style.top = `${normalizedY}px`;
    contextMenu.style.left = `${normalizedX}px`;

    setTimeout(() => {
        contextMenu.classList.add("visible");
    });
});

scope.addEventListener("click", (e) => {
    if (e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove("visible");
    }
});

let texture1 = null;
let texture2 = null;
let texture3 = null;
let texture4 = null;
let texture5 = null;

const loadTexture = (gl, url) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);


        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    image.crossOrigin = "anonymous";
    image.src = url;

    return texture;
}

const loadTextures = () => {
    const gl = glCanvas.getContext("webgl", { preserveDrawingBuffer: true }) || glCanvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
    if (!gl)
        alert("Your browser does not support WebGL");

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const pid = document.querySelector("#project-id").dataset.projectId

    texture1 = loadTexture(gl, '/pimg/' + pid + '/0');
    texture2 = loadTexture(gl, '/pimg/' + pid + '/1');
    texture3 = loadTexture(gl, '/pimg/' + pid + '/2');
    texture4 = loadTexture(gl, '/pimg/' + pid + '/3');
    texture5 = loadTexture(gl, '/pimg/' + pid + '/4');
    texture6 = loadTexture(gl, '/pimg/' + pid + '/5');
    texture7 = loadTexture(gl, '/pimg/' + pid + '/6');
    texture8 = loadTexture(gl, '/pimg/' + pid + '/7');
}

loadTextures();

const vertShader =
    `
precision mediump float;
attribute vec2 aPosition;
attribute vec2 aTexCoord;

varying vec2 texCoord;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    texCoord = aTexCoord;
}`;

let fragShader =
    `precision mediump float;
varying vec2 texCoord;

void main(){
	gl_FragColor = vec4(vec3(1.0), 1.0);
}
`

let glMouseX = 0;
let glMouseY = 0;

const resize = () => {
    glCanvas.width = window.innerWidth;
    glCanvas.height = window.innerHeight;
}

glCanvas.onresize = resize;
resize();

const createShader = (gl, sourceCode, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw `Could not compile WebGL program.\n\n${sourceCode} \n\n${info}`;
    }
    return shader;
}

const createProgram = (gl) => {
    var vertexShader = createShader(gl, vertShader, gl.VERTEX_SHADER);
    var fragmentShader = createShader(gl, fragShader, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        throw `Could not compile WebGL program. \n\n${info}`;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    return program;
}

const draw = (glCanvas) => {
    const gl = glCanvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl)
        alert("Your browser does not support WebGL");

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.75, 0.44, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let isCompiled = false;
    let prog = null;
    try {
        prog = createProgram(gl);
        isCompiled = true;
    }
    catch (err) {
        alert(err);
    }

    if (isCompiled) {
        compileButton.className = "control-btn-green";
        setTimeout(() => { compileButton.className = "control-btn"; }, 200)
    }
    else {
        compileButton.className = "control-btn-red";
        setTimeout(() => { compileButton.className = "control-btn"; }, 200)
        return;
    }

    let quadPoints = new Float32Array([
        -1, -1, 0, 0,
        1, -1, 1, 0,
        -1, 1, 0, 1,
        1, 1, 1, 1,
        1, -1, 1, 0,
        -1, 1, 0, 1
    ]);

    let quadIndexes = new Int32Array([0, 1, 3, 2, 1, 3]);

    var VBO = gl.createBuffer();
    var EBO = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, quadPoints, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIndexes, gl.STATIC_DRAW);

    gl.useProgram(prog);

    var aPosLocation = gl.getAttribLocation(prog, 'aPosition');
    gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.enableVertexAttribArray(aPosLocation);

    var aPosLocation = gl.getAttribLocation(prog, 'aTexCoord');
    gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
    gl.enableVertexAttribArray(aPosLocation);

    let timeBegin = new Date().getTime();
    let timeUniLoc = gl.getUniformLocation(prog, "time");
    let mouseUniLoc = gl.getUniformLocation(prog, "mousePosition");

    let timeD = 0;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture3);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture4);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture5);

    let imgUniLoc0 = gl.getUniformLocation(prog, "img0");
    let imgUniLoc1 = gl.getUniformLocation(prog, "img1");
    let imgUniLoc2 = gl.getUniformLocation(prog, "img2");
    let imgUniLoc3 = gl.getUniformLocation(prog, "img3");
    let imgUniLoc4 = gl.getUniformLocation(prog, "img4");

    gl.uniform1i(imgUniLoc0, 0);
    gl.uniform1i(imgUniLoc1, 1);
    gl.uniform1i(imgUniLoc2, 2);
    gl.uniform1i(imgUniLoc3, 3);
    gl.uniform1i(imgUniLoc4, 4);

    function updateAndRedraw() {
        timeD = new Date().getTime() - timeBegin;

        gl.uniform1f(timeUniLoc, timeD / 1000.0);

        gl.uniform2f(mouseUniLoc, glMouseX, glMouseY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        setTimeout(function () { window.requestAnimationFrame(updateAndRedraw) }, 1);
    }

    updateAndRedraw();
}

glCanvas.onmousemove = (e) => {
    const rect = glCanvas.getBoundingClientRect();
    glMouseX = (e.clientX - rect.left) / rect.width;
    glMouseY = (e.clientY - rect.top) / rect.height;
}

glCanvas.setAttribute('crossOrigin', 'anonymous');
draw(glCanvas);
const getScrollLeft = () => { return (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft; }
const getScrollTop = () => { return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop; }


const getMatrix = () => {
    let matrixDevided = mainEditorDiv.style.transform.replace("matrix(", "").replace(")", "").split(", ");
    for (let i = 0; i < matrixDevided.length; i++)
        matrixDevided[i] = Number(matrixDevided[i]);
    return matrixDevided;
}

const nodeFactory = new NodeFactory()

const setNodesToContextMenu = (groupsNnodes) => {
    contextMenuNodes.innerHTML = '';
    let innerInnerDiv;
    let appendNodeDiv = document.createElement("div");
    document.querySelector("#new-node-btn").onmousedown = function () {
        if (appendNodeDiv.parentNode !== null)
            contextMenuNodes.removeChild(appendNodeDiv);
        else
            contextMenuNodes.appendChild(appendNodeDiv);
    }
    appendNodeDiv.id = "new-node-options";
    for (let i = 0; i < groupsNnodes.length; i++) {
        let innerDiv = document.createElement("div");
        innerDiv.id = "group" + i;
        innerDiv.className = "item-group";

        titleDiv = document.createElement("div");
        titleDiv.id = "group" + i + "title";
        titleDiv.className = "item";
        titleDiv.innerHTML = "<b>" + groupsNnodes[i][0] + "</b>";
        titleDiv.onmousedown = function () {
            for (const child of innerDiv.children) {
                child.className = child.className === "item-sml" ? "item-hidden" : "item-sml";
            }
        }
        appendNodeDiv.appendChild(titleDiv);

        // Change from 1 later
        for (let j = 1; j < groupsNnodes[i].length; j++) {
            innerInnerDiv = document.createElement("div");
            innerInnerDiv.id = "group" + i + "item" + j;
            innerInnerDiv.className = "item-hidden";
            innerInnerDiv.onmousedown = function () {
                Editor.allNodes.push(nodeFactory.nodeFromFunction(
                    groupsNnodes[i][j][0],
                    groupsNnodes[i][j][1] ? groupsNnodes[i][j][1] : [],
                    groupsNnodes[i][j][2] ? groupsNnodes[i][j][2] : []
                ));
                let xOff = nodeEditorDiv.getBoundingClientRect().left;
                let yOff = nodeEditorDiv.getBoundingClientRect().top;
                Editor.allNodes[Editor.allNodes.length - 1].positionX =
                    (mouseX - getMatrix()[4] + getScrollLeft() - xOff) / getMatrix()[0];
                Editor.allNodes[Editor.allNodes.length - 1].positionY =
                    (mouseY - getMatrix()[5] + getScrollTop() - yOff) / getMatrix()[3];
                Editor.allNodes[Editor.allNodes.length - 1].draw(mainEditorDiv);
            }
            innerInnerDiv.innerHTML = groupsNnodes[i][j][0].replace("(", " ").split(" ")[1].replaceAll("_", " ");
            innerDiv.appendChild(innerInnerDiv);
        }
        appendNodeDiv.appendChild(innerDiv);
    }
}

var stock =
    [
        ["Inputs",
            [`
float texCoordX(){
	return texCoord.x;
}
	`, ["varying vec2 texCoord;"]],

            [`
float texCoordY(){
	return texCoord.y;
}
	`, ["varying vec2 texCoord;"]],

            [`
vec2 texCoord_(){
	return texCoord;
}
	`, ["varying vec2 texCoord;"]],

            [`
float _time(){
	return time;
}
	`, ["uniform float time;"]],

            [`
vec2 mousePos() {
	return mousePosition;
}
	`, ['uniform vec2 mousePosition;']]],
        ["Outputs",

            [`
void colorOutput(vec4 color){
	gl_FragColor = color;
}
	`, []]], ["Math",

            [`
float _sin(float argument){
	return sin(argument);
}
	`, []],

            [`
float _pow(float argument, float power){
	return pow(argument, power);
}
	`, []],

            [`	
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}`, []],

            [`
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
	`, []],

            [`
float avg(float a, float b, float c, float d){
	return (a + b + c + d) / 4.0;
}
	`, []],

            [`
float multiplyff(float a, float b){
	return a * b;
}
	`, []],

            [`
vec2 multiplyv2f(vec2 a, float b){
	return a * b;
}
	`, []],

            [`
vec4 multiplyv4f(vec4 a, float b){
	return a * b;
}
	`, []],

            [`
float plus(float a, float b){
	return a + b;
}
	`, []],

            [`
vec2 plusv2(vec2 a, vec2 b){
	return a + b;
}
	`, []],

            [`
vec4 plusv4(vec4 a, vec4 b){
	return a + b;
}
	`, []],

            [`
float minus(float a, float b){
	return a - b;
}
	`, []],

        ],

        ["Conversions",

            [`
float vec2_x(vec2 target){
	return target.x;
}
	`, []],

            [`
float vec2_y(vec2 target){
	return target.y;
}
	`, []],

            [`
float vec4_r(vec4 target){
	return target.r;
}
	`, []],

            [`
float vec4_g(vec4 target){
	return target.g;
}
	`, []],

            [`
float vec4_b(vec4 target){
	return target.b;
}
	`, []],

            [`
float vec4_a(vec4 target){
	return target.a;
}
	`, []],

            [`
vec4 fromFloatV4(float x, float y, float z, float w){
	return vec4(x, y, z, w);
}
	`, []],

            [`
vec2 fromFloatV2(float x, float y){
	return vec2(x, y);
}
	`, []],

        ],



        ["Constants",

            [`
float _float(){
	return value;
}
	`, [], ["float value"]],

            [`
vec2 _vec2(){
	return vec2(x, y);
}
	`, [], ["float x", "float y"]],

            [`
vec4 _vec4(){
	return vec4(r, g, b, w);
}
	`, [], ["float r", "float g", "float b", "float w"]],

            [`
int _int(){
	return value;
}
	`, [], ["int value"]]],

        ["Logic",

            [`
float multiplex(float valTrue, float valFalse, bool condition){
	if(condition){
		return valTrue;
	}
	return valFalse;
}
	`, []],
            [`
bool isBigger(float valLeft, float valRight){
	return valLeft > valRight;
}
	`, []]


        ], ["Textures",
            [`
vec4 _texture_0(vec2 coord){
	return texture2D(img0, coord);
}	
		`, ["uniform sampler2D img0;"]],
            [`
vec4 _texture_1(vec2 coord){
	return texture2D(img1, coord);
}	
		`, ["uniform sampler2D img1;"]],
            [`
vec4 _texture_2(vec2 coord){
	return texture2D(img2, coord);
}	
		`, ["uniform sampler2D img2;"]],
            [`
vec4 _texture_3(vec2 coord){
	return texture2D(img3, coord);
}	
		`, ["uniform sampler2D img3;"]],
            [`
vec4 _texture_4(vec2 coord){
	return texture2D(img4, coord);
}	
		`, ["uniform sampler2D img4;"]]
        ], ["Custom"
        ]
    ];


// Get nodes used by user
usedNodes = []
usedNodesMetas.forEach(e => usedNodes.push(e.dataset['usedNode']));
function formatNode(text) {
    text = text.replace(/ *\/\/([^\n]*) */g, "");
    let unifsNattribs = [];
    let lastIndex = 0
    for (let i = 0; i < text.split('\n').length; i++) {
        if (text.split('\n')[i].startsWith("uniform") || text.split('\n')[i].startsWith("attrib")) {
            unifsNattribs.push(text.split('\n')[i]);
            lastIndex = i + 1;
        }
    }
    let actualText = (text + "\n").split("\n").slice(lastIndex, -1).join("\n");
    return [actualText, unifsNattribs];
}
usedNodes.forEach(e => stock[7].push(formatNode(e)));

setNodesToContextMenu(stock);
// Taken from https://www.w3schools.com/howto/howto_js_draggable.asp

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        Editor.somethingIsBeingDragged = true;
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX / getMatrix()[0];
        pos4 = e.clientY / getMatrix()[3];
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX / getMatrix()[0];
        pos2 = pos4 - e.clientY / getMatrix()[3];
        pos3 = e.clientX / getMatrix()[0];
        pos4 = e.clientY / getMatrix()[3];
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        Editor.somethingIsBeingDragged = false;
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const strokeWidth = 5;

class BezierConnector {
    static latestConnectorID = 0;

    // For besier curves from point A (x0, y0) to B (x1, y1)
    constructor(x0, y0, x1, y1, color) {
        this.id = BezierConnector.latestConnectorID++;
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.color = color;

        this.connectorContainer = document.createElement('div');
    }

    genElement() {
        // Container
        this.connectorContainer.className = "connector-container";
        this.connectorContainer.id = "connector" + this.id;
        this.connectorContainer.style = "pointer-events: none; position:absolute; left:" + (Math.min(this.x0, this.x1) - strokeWidth) + "px; top:" + (Math.min(this.y0, this.y1) - strokeWidth) + "px;;";
        this.connectorContainer.innerHTML = this.genBesierCode();

        return this.connectorContainer;
    }

    genBesierCode() {

        let nx0 = this.x0 - Math.min(this.x0, this.x1);
        let nx1 = this.x1 - Math.min(this.x0, this.x1);
        let ny0 = this.y0 - Math.min(this.y0, this.y1);
        let ny1 = this.y1 - Math.min(this.y0, this.y1);

        // InnerHTML is code for besier
        let svgB = "<svg width=\"" + (Math.abs(nx0 - nx1) + 2 * strokeWidth) + "\" height=\"" + (Math.abs(ny0 - ny1) + 2 * strokeWidth) + "\" xmlns=\"http://www.w3.org/2000/svg\">";
        let svgE = "</svg>";

        // For smooth transitions
        let lc = Math.abs(this.x0 - this.x1) / 2;

        // Curve itself
        let curveSvg = ""
        if (ny0 < ny1)
            curveSvg = '<path d="M ' + (nx0 + strokeWidth) + ' ' + (ny0 + strokeWidth) +
                ' C ' + (strokeWidth + lc) + ' ' + strokeWidth +
                ', ' + (Math.abs(nx0 - nx1) - lc - strokeWidth) + ' ' + (Math.abs(ny0 - ny1) - strokeWidth) +
                ', ' + (nx1 + strokeWidth) + ' ' + (ny1 + strokeWidth) +
                '" stroke="' + this.color + '"  stroke-width="' + strokeWidth + '" fill="transparent"/';
        else
            curveSvg = '<path d="M ' + (nx0 + strokeWidth) + ' ' + (ny0 + strokeWidth) +
                ' C ' + (Math.abs(nx0 - nx1) - lc - strokeWidth) + ' ' + (Math.abs(ny0 - ny1) - strokeWidth) +
                ', ' + (strokeWidth + lc) + ' ' + strokeWidth +
                ', ' + (nx1 + strokeWidth) + ' ' + (ny1 + strokeWidth) +
                '" stroke="' + this.color + '"  stroke-width="' + strokeWidth + '" fill="transparent"/';

        return svgB + curveSvg + svgE;
    }
}

const recalculateVisualConnections = () => {
    for (let i = 0; i < Editor.allNodes.length; i++) {
        for (let j = 0; j < Editor.allNodes[i].inputs.length; j++)
            Editor.allNodes[i].inputs[j].recalculateVisualConnections();

        if (Editor.allNodes[i].nodeContainer !== null) {
            Editor.allNodes[i].positionX = Number(Editor.allNodes[i].nodeContainer.style.left.slice(0, -2));
            Editor.allNodes[i].positionY = Number(Editor.allNodes[i].nodeContainer.style.top.slice(0, -2));
        }
    }
}

setInterval(recalculateVisualConnections, 4);
const loadFromJson = (json) => {
    const nodeFactory = new NodeFactory();
    const findOutput = (outputName) => {
        for (let i = 0; i < Editor.allNodes.length; i++)
            if (Editor.allNodes[i].output.fullName() === outputName)
                return Editor.allNodes[i].output;
        return null;
    }
    let projectObject = null
    Editor.allNodes = [];
    try {
        projectObject = JSON.parse(json);
    }
    catch (_) { return }

    for (let i = 0; i < projectObject.length; i++) {
        let parsed = nodeFactory.nodeFromJson(projectObject[i]);

        for (let j = 0; j < projectObject[i].inputs.length; j++)
            parsed.inputs.push(new NodeInput(parsed, projectObject[i].inputs[j].type, projectObject[i].inputs[j].name, projectObject[i].inputs[j].id));

        for (let j = 0; j < projectObject[i].parameters.length; j++) {
            parsed.parameters.push(new NodeParameter(parsed, projectObject[i].parameters[j].type, projectObject[i].parameters[j].name, projectObject[i].parameters[j].id));
            parsed.parameters[parsed.parameters.length - 1].value = projectObject[i].parameters[j].value;
        }

        parsed.output = new NodeOutput(parsed, projectObject[i].output.type, projectObject[i].output.name, 0);

        Editor.allNodes.push(parsed);
    }

    for (let i = 0; i < Editor.allNodes.length; i++) {
        Editor.allNodes[i].draw(mainEditorDiv);
    }

    for (let i = 0; i < Editor.allNodes.length; i++) {
        for (let j = 0; j < Editor.allNodes[i].inputs.length; j++) {
            if (projectObject[i].inputs[j].connectedSource != "null") {
                Editor.allNodes[i].inputs[j].connectSource(findOutput(projectObject[i].inputs[j].connectedSource));
            }
        }
    }
}

let m = document.querySelector("#json-code");
loadFromJson(m.dataset.jsonCode);
compileButton.onmousedown();
panzoom(mainEditorDiv, {
    beforeMouseDown: function () {
        var shouldIgnore = Editor.somethingIsBeingDragged | Editor.somethingIsBeingConnected;
        return shouldIgnore;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Query the element
    const resizer = document.getElementById('dragger');
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;
    let leftWidth = 0;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;
        leftWidth = leftSide.getBoundingClientRect().width;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.width = `${newLeftWidth}%`;

        resizer.style.cursor = 'col-resize';
        document.body.style.cursor = 'col-resize';

        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';

        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';
    };

    const mouseUpHandler = function () {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    resizer.addEventListener('mousedown', mouseDownHandler);
});
const alg1 = () => {
    let moved = [];

    const getChildrenHeightSum = (node) => {
        let accum = 0;
        node.inputs.forEach(element => accum += getChildrenHeightSum(element.connectedSource.baseNode));

        return Math.max(node.height + 30, accum);
    }

    const setPosition = (st, node, level) => {
        /*if (moved.includes(node)) return;
        moved.push(node);*/
        let sum = 0;
        node.inputs.forEach(element => {
            sum += setPosition(st + sum, element.connectedSource.baseNode, level + 1);
        })
        node.positionX = -300 * level;
        node.positionY = st;
        node.updateContStyle();
        return getChildrenHeightSum(node);
    }

    const sort = () => {
        moved = [];
        let outputNodes = [];

        // Take output nodes
        for (let i = 0; i < Editor.allNodes.length; i++)
            if (Editor.allNodes[i].output.type === "void")
                outputNodes.push(Editor.allNodes[i]);

        outputNodes.forEach(element => setPosition(0, element, 0))
    }

    sort();
}

const alg2 = () => {
    let layers = []

    const getChildrenHeightSum = (node) => {
        let accum = 0;
        node.inputs.forEach(element => accum += getChildrenHeightSum(element.connectedSource.baseNode));

        return Math.max(node.height + 30, accum);
    }

    const setPosition = (st, node, level) => {
        /*if (moved.includes(node)) return;
        moved.push(node);*/
        let sum = 0;
        node.inputs.forEach(element => {
            sum += setPosition(st + sum, element.connectedSource.baseNode, level + 1);
        })
        node.positionX = -300 * level;
        node.positionY = st;
        node.updateContStyle();
        return getChildrenHeightSum(node);
    }

    const sort = () => {
        moved = [];
        let outputNodes = [];

        // Take output nodes
        for (let i = 0; i < Editor.allNodes.length; i++)
            if (Editor.allNodes[i].output.type === "void")
                outputNodes.push(Editor.allNodes[i]);

        outputNodes.forEach(element => setPosition(0, element, 0))
    }

    sort();
}


sortPrButton.onmousedown = alg2;