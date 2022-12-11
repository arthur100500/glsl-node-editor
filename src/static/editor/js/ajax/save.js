const savenotify = () => $.notify("Saved code", "success", {
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 1000,
    className: "save-note"
});


const errornotify = (msg) => $.notify(msg, "error", {
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 1000,
    className: "save-note"
});


savePrButton.onmousedown = function () {
    let code = "";
    for (let i = 0; i < Editor.allNodes.length; i++)
        code += Editor.allNodes[i].toJson() + ", ";
    code = "[" + code.slice(0, -2) + "]"

    let pname = prName.innerHTML;
    let pdesc = prDesc.innerHTML;

    let pid = document.querySelector("#project-id").dataset.projectId

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/save_project',
        data: { name: pname, desc: pdesc, json_code: code, id: pid },
        success: function (response) {
            if (!(response === "success")) {
                errornotify(response);
            }
            else
                savenotify();
        },
        error: function (err) {
            if (err.responseText === "success")
                savenotify();
            else
                errornotify(err.responseText);
        }
    });

    $.ajax({
        type: 'POST',
        dataType: 'data',
        url: '/set_img/' + pid,
        data: { img: glCanvas.toDataURL() },
        success: function (_) {

        },
        error: function (_) {

        }
    });
}

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        savePrButton.onmousedown();
    }
});