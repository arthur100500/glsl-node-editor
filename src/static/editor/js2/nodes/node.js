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