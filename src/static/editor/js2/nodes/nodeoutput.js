
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