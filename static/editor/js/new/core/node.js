class Node {
    constructor() {
        this.name = "New node";
        this.code_id = -1;
        this.code = "";
        this.author = "";
        this.id = latestNodeID++;
        this.inputs = []
        this.output = null;
        this.additionElements = [];
        this.parameters = [];
        this.positionX = 0;
        this.positionY = 0;
    }

    fullName() {
        return "node" + this.name + this.id;
    }

    toJson() {
        let nodeJson = JSON.stringify(this, ['name', 'code', 'id', 'additionElements', 'parameters', 'positionX', 'positionY', 'width', 'height']);
        let inputsJson = [];
        let paramsJson = [];
        let outputJson = this.output.toJson();
        for (let i = 0; i < this.inputs.length; i++)
            inputsJson.push(this.inputs[i].toJson());
        for (let i = 0; i < this.parameters.length; i++)
            paramsJson.push(this.parameters[i].toJson());
        return nodeJson.slice(0, -1) + ", \"inputs\": [" + inputsJson.join(", ") + "], \"parameters\": [" + paramsJson.join(", ") + "], \"output\": " + outputJson + "}";
    }
}

class NodeInput {
    constructor(baseNode, dataType, inputName, id) {
        this.baseNode = baseNode;
        this.type = dataType;
        this.name = inputName;
        this.id = id;
        this.connectedSource = null;
        this.color = typeColors[this.type];
        if (this.color === null) this.color = "#ff0000";
    }

    toJson() {
        let inputJson = JSON.stringify(this, ['type', 'name', 'id']);
        let connectedSourceJson = this.connectedSource !== null ? this.connectedSource.fullName() : "null";
        return inputJson.slice(0, -1) + ", \"connectedSource\": \"" + connectedSourceJson + "\"}";
    }

    connectSource(source) {
        // Check if new connection is typed right
        if (source.type !== this.type) return;
        this.connectedSource = source;
    }

    fullName() {
        return "node" + this.baseNode.id + "input" + this.id;
    }
}

class NodeOutput {
    constructor(baseNode, dataType, outputName, id) {
        this.baseNode = baseNode;
        this.type = dataType;
        this.name = outputName;
        this.id = id;
        this.color = typeColors[this.type];
        if (this.color == null) this.color = "#ff0000";
    }

    toJson() {
        return JSON.stringify(this, ['type', 'name', 'id']);
    }

    fullName() {
        return "node" + this.baseNode.id + "output" + this.id;
    }
}

class NodeParameter {
    constructor(baseNode, dataType, name, id) {
        this.baseNode = baseNode;
        this.type = dataType;
        this.name = name;
        this.id = id;
        this.value;
        this.validator = () => {
            return true;
        };
    }

    validate() {
        return this.validator(this.value);
    }

    toJson() {
        return JSON.stringify(this, ['type', 'name', 'id', 'value']);
    }
}
