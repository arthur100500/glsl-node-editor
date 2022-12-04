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