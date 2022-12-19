export default class NodeFactory {
    static latestNodeID = 0;

    static fromJson(jsonCode) {
        let nodeObject = JSON.parse(jsonCode);
        return NodeFactory.fromObject(nodeObject);
    }

    static fromObject(nodeObject) {
        let inputsObjects = [];
        for (var i in nodeObject.inputs)
            inputsObjects.push({
                name: nodeObject.inputs[i].name,
                type: nodeObject.inputs[i].type
            });

        NodeFactory.latestNodeID = Math.max(NodeFactory.latestNodeID, nodeObject.id + 1);

        return {
            id: "node-" + nodeObject.id,
            position: { x: nodeObject.positionX, y: nodeObject.positionY },
            type: 'usual',
            data: {
                id: "node-" + nodeObject.id,
                title: nodeObject.name,
                inputs: inputsObjects,
                type: nodeObject.output.type,
                code: nodeObject.code,
            }
        }
    }

    static manyFromJson(jsonCode) {
        let nodeObjects = JSON.parse(jsonCode);
        let nodeObjectsParsed = [];
        for (var index in nodeObjects)
            nodeObjectsParsed.push(this.fromObject(nodeObjects[index]));

        return nodeObjectsParsed;
    }

    static fromCode(glslCode, additionalElems = [], additionalParams = []) {
        let fnCode = glslCode.trim();
        let node = { id: '' + this.latestNodeID };
        node.additionElements = additionalElems;

        const regexp = /[a-zA-Z_0-9]+ [a-zA-Z_0-9[\]]+/g;
        const array = [...fnCode.split("\n")[0].match(regexp)];

        node.data.title = array[0].split(" ")[1];
        node.data.type = array[0].split(" ")[0];

        for (let i = 1; i < array.length; i++)
            node.data.inputs[i - 1] = { name: array[i].split(" ")[0], type: array[i].split(" ")[1], id: i - 1 }

        for (let i = 0; i < additionalParams.length; i++)
            node.data.parameters[i] = { name: additionalParams[i].split(" ")[0], type: additionalParams[i].split(" ")[1], i }

        let header = fnCode.split("{")[0].replace(")", "") + ((array.length > 1 && additionalParams.length > 0) ? ", " : "") + additionalParams.join(", ") + "){";
        node.data.code = header + fnCode.split("{").slice(1).join("{");
        return node;
    }
}
