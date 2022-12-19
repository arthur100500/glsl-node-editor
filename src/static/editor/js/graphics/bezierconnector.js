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
