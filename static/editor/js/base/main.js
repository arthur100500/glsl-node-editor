let allNodes = [];

function recalculateVisualConnections() {
  for (let i = 0; i < allNodes.length; i++) {
    for (let j = 0; j < allNodes[i].inputs.length; j++) { allNodes[i].inputs[j].recalculateVisualConnections(); }

    if (allNodes[i].nodeContainer !== null) {
      allNodes[i].positionX = Number(allNodes[i].nodeContainer.style.left.slice(0, -2));
      allNodes[i].positionY = Number(allNodes[i].nodeContainer.style.top.slice(0, -2));
    }
  }
}

function main() {
  recalculateVisualConnections();
  setInterval(recalculateVisualConnections, 4);
}

// Takes text of a function in GLSL, gives out Node
// Additional elements will be appended to the file beginning
// Additional parameters will be used as additional arguments for a function
function nodeFromFunction(fnCode, additionalElems = [], additionalParams = []) {
  fnCode = fnCode.trim();
  node = new Node();
  node.additionElements = additionalElems;

  const regexp = /[a-zA-Z_0-9]+ [a-zA-Z_0-9\[\]]+/g;
  const array = [...fnCode.split('\n')[0].match(regexp)];

  node.name = array[0].split(' ')[1];
  node.output = new NodeOutput(node, array[0].split(' ')[0], 'result', 0);

  for (let i = 1; i < array.length; i++) { node.inputs[i - 1] = new NodeInput(node, array[i].split(' ')[0], array[i].split(' ')[1], i - 1); }

  for (let i = 0; i < additionalParams.length; i++) { node.parameters[i] = new NodeParameter(node, additionalParams[i].split(' ')[0], additionalParams[i].split(' ')[1], i); }

  const header = `${fnCode.split('{')[0].replace(')', '') + ((array.length > 1 && additionalParams.length > 0) ? ', ' : '') + additionalParams.join(', ')}){`;
  node.code = header + fnCode.split('{').slice(1).join('{');
  return node;
}

function clearAllNodes() {
  const e = mainEditorDiv;
  let child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }

  allNodes = [];
}

function assamble(nodes) {
  const allNodesDefined = [];
  // Makes code from nodes
  const shaderHeader = `
precision mediump float;

`;

  function removeRedefenitions(statements) {
    statementsArr = statements.split('\n');
    resultingDefenitions = [];
    usedDefenitions = [];
    for (let i = 0; i < statementsArr.length; i++) {
      if (!usedDefenitions.includes(statementsArr[i].split(' ').slice(0, 3).join(' '))) {
        resultingDefenitions.push(statementsArr[i]);
      }
      usedDefenitions.push(statementsArr[i].split(' ').slice(0, 3).join(' '));
    }

    return resultingDefenitions.join('\n');
  }

  let allAdditionalElements = [];

  for (let i = 0; i < allNodes.length; i++) {
    for (let j = 0; j < allNodes[i].additionElements.length; j++) { allAdditionalElements.push(allNodes[i].additionElements[j]); }
  }

  allAdditionalElements = removeRedefenitions(allAdditionalElements.join('\n'));

  const outputNodes = [];
  let code = `${shaderHeader + allAdditionalElements}\n\n\n`;

  // Build all functions
  for (let i = 0; i < allNodes.length; i++) {
    if (!allNodesDefined.includes(allNodes[i].code.replace('(', ' ').split(' ')[1])) { code += `${allNodes[i].code}\n\n`; }
    allNodesDefined.push(allNodes[i].code.replace('(', ' ').split(' ')[1]);
  }

  // Take output nodes
  for (let i = 0; i < allNodes.length; i++) {
    if (allNodes[i].output.type === 'void') { outputNodes.push(allNodes[i]); }
  }

  function assambleCode(node) {
    nCode = '';
    for (let i = 0; i < node.inputs.length; i++) {
      if (node.inputs[i].connectedSource != null) { nCode += assambleCode(node.inputs[i].connectedSource.baseNode); }
    }

    let fnInputs = '';

    for (let i = 0; i < node.inputs.length; i++) {
      if (node.inputs[i].connectedSource != null) { fnInputs += `${node.inputs[i].connectedSource.baseNode.name + node.inputs[i].connectedSource.baseNode.id}, `; }
    }

    for (let i = 0; i < node.parameters.length; i++) { fnInputs += `${node.parameters[i].value}, `; }

    fnInputs = fnInputs.slice(0, -2);

    // Node name is function signature??? Make sure later
    if (node.output.type === 'void') { nCode += `\t${node.name}(${fnInputs});\n`; } else { nCode += `\t${node.output.type} ${node.name}${node.id} = ${node.name}(${fnInputs});\n\n`; }
    return nCode;
  }

  code += 'void main(){\n';
  for (let i = 0; i < outputNodes.length; i++) { code += removeRedefenitions(assambleCode(outputNodes[i])); }
  code += '\n}';

  return code;
}

compileButton.onmousedown = function () {
  code = assamble();
  fragShader = code;
  draw(glCanvas);
};

saveShButton.onmousedown = function () {
  code = assamble();
  download('shader.glsl', code);
};

savePrButton.onmousedown = function () {
  let code = '';
  for (let i = 0; i < allNodes.length; i++) { code += `${allNodes[i].toJson()}, `; }
  code = `[${code.slice(0, -2)}]`;

  const pname = prName.innerHTML;
  const pdesc = prDesc.innerHTML;

  const pid = document.querySelector('#project-id').dataset.projectId;

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/save_project',
    data: {
      name: pname, desc: pdesc, json_code: code, id: pid,
    },
    success(response) {
      if (!(response === 'success')) {
        console.log(response);
      }
    },
    error(error) {
      console.log(error);
    },
  });

  $.ajax({
    type: 'POST',
    dataType: 'data',
    url: `/set_img/${pid}`,
    data: { img: glCanvas.toDataURL() },
    success(response) {
      if (!(response === 'success')) {
        console.log(response);
      }
    },
    error(error) {
      console.log(error);
    },
  });
};

function loadFromJson(json) {
  function findOutput(outputName) {
    for (let i = 0; i < allNodes.length; i++) {
      if (allNodes[i].output.fullName() === outputName) { return allNodes[i].output; }
    }
    return null;
  }

  allNodes = [];
  const projectObject = JSON.parse(json);
  // Nodes from Object
  for (let i = 0; i < projectObject.length; i++) {
    const parsed = new Node();
    parsed.name = projectObject[i].name;
    parsed.code = projectObject[i].code;
    parsed.id = projectObject[i].id;
    parsed.additionElements = projectObject[i].additionElements;
    parsed.height = projectObject[i].height;
    parsed.width = projectObject[i].width;
    parsed.positionX = projectObject[i].positionX;
    parsed.positionY = projectObject[i].positionY;
    parsed.parameters = [];
    parsed.inputs = [];

    for (let j = 0; j < projectObject[i].inputs.length; j++) { parsed.inputs.push(new NodeInput(parsed, projectObject[i].inputs[j].type, projectObject[i].inputs[j].name, projectObject[i].inputs[j].id)); }

    for (let j = 0; j < projectObject[i].parameters.length; j++) {
      parsed.parameters.push(new NodeParameter(parsed, projectObject[i].parameters[j].type, projectObject[i].parameters[j].name, projectObject[i].parameters[j].id));
      parsed.parameters[parsed.parameters.length - 1].value = projectObject[i].parameters[j].value;
    }

    parsed.output = new NodeOutput(parsed, projectObject[i].output.type, projectObject[i].output.name, 0);

    allNodes.push(parsed);
  }
  for (let i = 0; i < allNodes.length; i++) {
    allNodes[i].draw(mainEditorDiv);
  }

  for (let i = 0; i < allNodes.length; i++) {
    for (let j = 0; j < allNodes[i].inputs.length; j++) {
      if (projectObject[i].inputs[j].connectedSource != 'null') {
        allNodes[i].inputs[j].connectSource(findOutput(projectObject[i].inputs[j].connectedSource));
      }
    }
  }
}

// load current project
const m = document.querySelector('#json-code');
loadFromJson(m.dataset.jsonCode);
compileButton.onmousedown();
