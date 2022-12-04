class NodeFactory {
    nodeFromFunction(fnCode, additionalElems = [], additionalParams = []) {
        fnCode = fnCode.trim();
        let node = new Node();
        node.additionElements = additionalElems;

        const regexp = /[a-zA-Z_0-9]+ [a-zA-Z_0-9\[\]]+/g;
        const array = [...fnCode.split("\n")[0].match(regexp)];

        node.name = array[0].split(" ")[1];
        node.output = new NodeOutput(node, array[0].split(" ")[0], "result", 0);

        for (let i = 1; i < array.length; i++)
            node.inputs[i - 1] = new NodeInput(node, array[i].split(" ")[0], array[i].split(" ")[1], i - 1);

        for (let i = 0; i < additionalParams.length; i++)
            node.parameters[i] = new NodeParameter(node, additionalParams[i].split(" ")[0], additionalParams[i].split(" ")[1], i);

        let header = fnCode.split("{")[0].replace(")", "") + ((array.length > 1 && additionalParams.length > 0) ? ", " : "") + additionalParams.join(", ") + "){";
        node.code = header + fnCode.split("{").slice(1).join("{");
        return node;
    }

    nodeFromJson(code) {
        let newNode = new Node();
        newNode.name = code.name;
        newNode.code = code.code;
        newNode.additionElements = code.additionElements;
        newNode.height = code.height;
        newNode.width = code.width;
        newNode.positionX = code.positionX;
        newNode.positionY = code.positionY;
        newNode.id = code.id;
        newNode.parameters = [];
        newNode.inputs = [];
        Node.latestNodeID = Math.max(Node.latestNodeID, newNode.id);

        return newNode;
    }
}