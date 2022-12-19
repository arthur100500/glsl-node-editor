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