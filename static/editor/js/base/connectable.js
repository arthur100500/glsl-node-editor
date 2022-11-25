let current = null;
let lastConnectionSource = null;

// onmouseup не работал так что я ввел костыль
const destinationElements = [];

// Source is ment to be NodeOutput
function setAbleToConnectFrom(elem, source) {
  elem.onmousedown = function () {
    const nodeBRect = source.baseNode.nodeContainer.style;
    const sourceBRect = elem.style;

    const x = Number(nodeBRect.left.replace('px', '')) + Number(sourceBRect.left.replace('px', ''));
    const y = Number(nodeBRect.top.replace('px', '')) + Number(sourceBRect.top.replace('px', ''));

    current = new BezierConnector(x + 20 / 2, y + 20 / 2, 0, 0, source.color);
    somethingIsBeingConnected = true;
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
  const xOff = nodeEditorDiv.getBoundingClientRect().left;
  const yOff = nodeEditorDiv.getBoundingClientRect().top;
  current.x1 = (mouseX - getMatrix()[4] + getScrollLeft() - xOff) / getMatrix()[0];
  current.y1 = (mouseY - getMatrix()[5] + getScrollTop() - yOff) / getMatrix()[3];
  mainEditorDiv.appendChild(current.genElement());
};

window.onmouseup = function (mEvent) {
  if (current === null) return;
  // Handle connections
  for (let i = 0; i < destinationElements.length; i++) {
    const bRect = destinationElements[i][0].getBoundingClientRect();
    if (mouseX < bRect.x + bRect.width && mouseX > bRect.x && mouseY < bRect.y + bRect.height && mouseY > bRect.y) { destinationElements[i][1].connectSource(lastConnectionSource); }
  }

  // Remove connection if mouse is up
  const unusedConnector = document.querySelector(`#connector${current.id}`);
  mainEditorDiv.removeChild(unusedConnector);

  // To avoid conflicts if it actually should work
  lastConnectionSource = null;
  current = null;
  somethingIsBeingConnected = false;
};
