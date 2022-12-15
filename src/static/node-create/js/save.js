savenotify = () => $.notify("Saved code", "success", {
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 1000,
    className: "save-note"
});

errornotify = (msg) => {
    $.notify(msg, "error", {
        clickToHide: true,
        autoHide: true,
        autoHideDelay: 1000,
        className: "save-note"
    }); console.log(123);
};

saveBtn.onmousedown = function () {
    let text = editor.getValue().replace(/ *\/\/([^\n]*) */g, "");

    let unifsNattribs = [];
    let lastIndex = 0
    for (let i = 0; i < text.split('\n').length; i++) {
        if (text.split('\n')[i].startsWith("uniform") || text.split('\n')[i].startsWith("attrib")) {
            unifsNattribs.push(text.split('\n')[i]);
            lastIndex = i + 1;
        }
    }
    let actualText = (text + "\n").split("\n").slice(lastIndex, -1).join("\n");

    let node = nodeFromFunctionPr(actualText, unifsNattribs);

    let node_data = { name: node.name, json_code: editor.getValue(), id: nodeId };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/save_node',
        data: node_data,
        success: function (response) {
            if (response !== "success")
                errornotify(response);
            else
                savenotify();
        },
        error: function (error) {
            if (error.status === 200)
                savenotify();
            else
                errornotify(error.responseText);
        }
    });
}


document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        saveBtn.onmousedown();
    }
});
