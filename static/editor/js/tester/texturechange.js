function changeTextureImage(obj) {
    let myFormData = new FormData();
    myFormData.append('file', obj.files[0]);

    $.ajax({
        type: 'POST',
        dataType: false,
        url: obj.attributes.addr.value,
        data: myFormData,
        processData: false, // important
        contentType: false, // important,
        success: function (response) {
            if (!(response === "success")) {
                console.log(response);
            }
            alert(response);
        },
        error: function (error) {
            console.log(error);
            alert(error.status);
        }
    });
}