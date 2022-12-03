let moved = [];

function getChildrenHeightSum(node) {
    let accum = 0;
    node.inputs.forEach(element => accum += getChildrenHeightSum(element.connectedSource.baseNode));

    return Math.max(node.height + 30, accum);
}

function setPosition(st, node, level) {
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

function sort() {
    moved = [];
    let outputNodes = [];

    // Take output nodes
    for (let i = 0; i < allNodes.length; i++)
        if (allNodes[i].output.type === "void")
            outputNodes.push(allNodes[i]);

    outputNodes.forEach(element => setPosition(0, element, 0))
}

sortPrButton.onmousedown = sort;