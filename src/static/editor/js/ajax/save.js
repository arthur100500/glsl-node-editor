const savenotify = () => $.notify("Saved code", "success", {
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
                console.log(response);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        type: 'POST',
        dataType: 'data',
        url: '/set_img/' + pid,
        data: { img: glCanvas.toDataURL() },
        success: function (response) {
            if (!(response === "success")) {
                console.log(response);
            }
            else
                savenotify();
        },
        error: function (error) {
            if (error.status === 200)
                savenotify();
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