class NodeParameter {
    constructor(baseNode, dataType, name, id) {
        this.baseNode = baseNode;
        this.type = dataType;
        this.name = name;
        this.id = id;

        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.className = "parameter-input";
        this.inputField.id = this.getFullName();
        this.inputField.name = this.getFullName() + "name";
    }

    set value(val) {
        this.inputField.value = val;
    }

    get value() {
        return this.getValue();
    }

    getValue() {
        return this.inputField.value;
    }

    getFullName() {
        return "param" + this.baseNode.name + this.baseNode.id + this.name + this.id;
    }

    getInput() {
        return this.inputField;
    }

    getLabel() {
        let lbl = document.createElement("span");
        lbl.style = "font-size: 14pt; margin-left:3px;";
        lbl.innerHTML = this.name + ": ";
        return lbl;
    }

    toJson() {
        return JSON.stringify(this, ['type', 'name', 'id', 'value']);
    }
}
