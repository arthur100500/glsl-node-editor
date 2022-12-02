let latestNodeID = 0;

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
	constructor(functional = true) {
		// Logic
		this.name = "New node";
		this.code = "";
		this.id = latestNodeID++;
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

		for (let i = 0; i < allNodes.length; i++) {
			for (let j = 0; j < allNodes[i].inputs.length; j++) {
				if (allNodes[i].inputs[j].connectedSource === this.output) {
					allNodes[i].inputs[j].connectedSource = null;
					mainEditorDiv.removeChild(allNodes[i].inputs[j].connectedSourceVisualConnection.connectorContainer);
				}
			}
		}

		allNodes.splice(allNodes.indexOf(this), 1);
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
		return this.inputField.value = val;
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
