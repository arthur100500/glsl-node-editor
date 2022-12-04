const loadFromJson = (json) => {
    const nodeFactory = new NodeFactory();
    const findOutput = (outputName) => {
        for (let i = 0; i < Editor.allNodes.length; i++)
            if (Editor.allNodes[i].output.fullName() === outputName)
                return Editor.allNodes[i].output;
        return null;
    }
    let projectObject = null
    Editor.allNodes = [];
    try {
        projectObject = JSON.parse(json);
    }
    catch (_) { return }

    for (let i = 0; i < projectObject.length; i++) {
        let parsed = nodeFactory.nodeFromJson(projectObject[i]);

        for (let j = 0; j < projectObject[i].inputs.length; j++)
            parsed.inputs.push(new NodeInput(parsed, projectObject[i].inputs[j].type, projectObject[i].inputs[j].name, projectObject[i].inputs[j].id));

        for (let j = 0; j < projectObject[i].parameters.length; j++) {
            parsed.parameters.push(new NodeParameter(parsed, projectObject[i].parameters[j].type, projectObject[i].parameters[j].name, projectObject[i].parameters[j].id));
            parsed.parameters[parsed.parameters.length - 1].value = projectObject[i].parameters[j].value;
        }

        parsed.output = new NodeOutput(parsed, projectObject[i].output.type, projectObject[i].output.name, 0);

        Editor.allNodes.push(parsed);
    }

    for (let i = 0; i < Editor.allNodes.length; i++) {
        Editor.allNodes[i].draw(mainEditorDiv);
    }

    for (let i = 0; i < Editor.allNodes.length; i++) {
        for (let j = 0; j < Editor.allNodes[i].inputs.length; j++) {
            if (projectObject[i].inputs[j].connectedSource != "null") {
                Editor.allNodes[i].inputs[j].connectSource(findOutput(projectObject[i].inputs[j].connectedSource));
            }
        }
    }
}

let m = document.querySelector("#json-code");
loadFromJson(m.dataset.jsonCode);
compileButton.onmousedown();