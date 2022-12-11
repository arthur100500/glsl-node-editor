function changeStyle(t) {
    if (t.className === "used") {
        t.className = "unused";
        t.innerHTML = "<span> Use </span>";
    } else {
        t.className = "used";
        t.innerHTML = "<span> Used </span>";
    }
}

function addNodeAjaxWID(pid, callback, t) {
    let txt = "add";
    if (t.innerHTML.includes("Used"))
        txt = "rem"

    $.ajax({
        type: 'POST',
        dataType: 'data',
        url: '/' + txt + '_node/' + pid,
        success: function (response) {
            if ((response === "success")) {
                callback(t)
            }
        },
        error: function (error) {
            if ((error.responseText === "success")) {
                callback(t)
            }
        }
    });
}