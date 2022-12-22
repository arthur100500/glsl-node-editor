// Assembles GLSL Shader from node list
const assamble = (allNodes) => {
    let allNodesDefined = [];
    let shaderHeader = `
#ifdef GL_ES
    precision mediump float;
#endif
`;

    function removeRedefenitions(statements) {
        statementsArr = statements.split("\n");
        resultingDefenitions = [];
        usedDefenitions = [];
        for (let i = 0; i < statementsArr.length; i++) {
            if (!usedDefenitions.includes(statementsArr[i].split(" ").slice(0, 3).join(" "))) {
                resultingDefenitions.push(statementsArr[i]);
            }
            usedDefenitions.push(statementsArr[i].split(" ").slice(0, 3).join(" "));
        }

        return resultingDefenitions.join("\n");
    }

    let allAdditionalElements = [];

    for (let i = 0; i < allNodes.length; i++)
        for (let j = 0; j < allNodes[i].additionElements.length; j++)
            allAdditionalElements.push(allNodes[i].additionElements[j]);

    allAdditionalElements = removeRedefenitions(allAdditionalElements.join("\n"))

    let outputNodes = [];
    let code = shaderHeader + allAdditionalElements + "\n\n\n";

    // Build all functions
    for (let i = 0; i < allNodes.length; i++) {
        if (!allNodesDefined.includes(allNodes[i].code.replace("(", " ").split(" ")[1]))
            code += allNodes[i].code + "\n\n";
        allNodesDefined.push(allNodes[i].code.replace("(", " ").split(" ")[1]);
    }

    // Take output nodes
    for (let i = 0; i < allNodes.length; i++)
        if (allNodes[i].output.type === "void")
            outputNodes.push(allNodes[i]);


    function assambleCode(node) {
        nCode = "";
        for (let i = 0; i < node.inputs.length; i++)
            if (node.inputs[i].connectedSource != null)
                nCode += assambleCode(node.inputs[i].connectedSource.baseNode);

        let fnInputs = "";

        for (let i = 0; i < node.inputs.length; i++)
            if (node.inputs[i].connectedSource != null)
                fnInputs += node.inputs[i].connectedSource.baseNode.name + node.inputs[i].connectedSource.baseNode.id + ", ";

        for (let i = 0; i < node.parameters.length; i++)
            fnInputs += node.parameters[i].value + ", ";

        fnInputs = fnInputs.slice(0, -2);

        //Node name is function signature??? Make sure later
        if (node.output.type === "void")
            nCode += "\t" + node.name + "(" + fnInputs + ");\n";
        else
            nCode += "\t" + node.output.type + " " + node.name + node.id + " = " + node.name + "(" + fnInputs + ");\n\n";
        return nCode;
    }

    code += "void main(){\n";
    for (let i = 0; i < outputNodes.length; i++)
        code += removeRedefenitions(assambleCode(outputNodes[i]));
    code += "\n}";

    return code;
}

compileButton.onmousedown = () => {
    code = assamble(Editor.allNodes);
    fragShader = code;
    draw(glCanvas);
}