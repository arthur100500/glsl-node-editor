changedSucc = () => $.notify("Changed successfully, refresh the page", "success", {
    clickToHide: true,
    autoHide: true,
    autoHideDelay: 1000,
    className: "save-note"
});

const changeTextureImage = (obj) => {
    let myFormData = new FormData();
    myFormData.append('file', obj.files[0]);

    $.ajax({
        type: 'POST',
        dataType: false,
        url: obj.attributes.addr.value,
        data: myFormData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (!(response === "success")) {
                console.log(response);
            }
            else {
                changedSucc();
            }
        },
        error: function (error) {
            if (error.status === 200)
                changedSucc();
        }
    });
}