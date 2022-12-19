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