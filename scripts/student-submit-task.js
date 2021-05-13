// JS for student-submit-task.js

// Create an empty array that stores the paths of images uploaded
var uploadedImagePaths = [];

/**
 * CITE - Implement a character limit counter.
 * 
 * @param {*} field - DOM-element that characters are being counted in
 * @param {*} field2 - ID of the DOM-element displaying the number of characters remaining
 * @param {*} maxlimit - Maximum number of characters allowed in "field"
 * @returns - false if the character limit has been exceeded
 */
function charCounter(field, field2, maxlimit) {
    var countfield = document.getElementById(field2);
    if (field.value.length > maxlimit) {
        field.value = field.value.substring(0, maxlimit);
        return false;
    } else {
        countfield.value = maxlimit - field.value.length;
    }
}

/**
 * Write this
 */
function checkNumUploaded() {
    const maxImages = 3;
    const message = "<div class='text-container'><p class='message'>You haven't uploaded any images</p></div>"
    if (uploadedImagePaths.length == maxImages) {
        $("#upload-image-input").attr("disabled");
    } else if (uploadedImagePaths.length == 0) {
        $(".uploaded-images").append(message);
    } else {
        if ($("#uploaded-image-input").attr("disabled")) {
            $("#upload-image-input").removeAttr("disabled");
        }
        if ($(".message")) {
            $(".message").remove();
        }
    }
}

/**
 * CITE - Write this.
 */
function processImage() {
    const imageInput = document.getElementById("upload-image-input");
    imageInput.addEventListener('change', function (event) {
        console.log(event.target.files[0]);
        var imagePath = event.target.files[0].name;
        uploadedImagePaths.push(imagePath);
        addPathToDOM();
    });
}

/**
 * Write this
 */
function resetDOM() {
    var uploadedImages = document.getElementsByClassName('uploaded-image');
    while (uploadedImages[0]) {
        uploadedImages[0].parentNode.removeChild(uploadedImages[0]);
    }
}

/**
 * Write this
 */
function addPathToDOM() {
    resetDOM();
    for (var i = 0; i < uploadedImagePaths.length; i++) {
        let imagePath = "<li><a class='uploaded-image' href='#'>" + uploadedImagePaths[i] + "</a></li>";
        $(".uploaded-images").append(imagePath);
    }
    checkNumUploaded();
    $("#upload-image-input").prop("value", null);
}

/**
 * Write this
 */
function onClickSubmit() {
    return 0;
}

// Run function when document is ready 
$(document).ready(function () {
    checkNumUploaded();
    processImage();
});
