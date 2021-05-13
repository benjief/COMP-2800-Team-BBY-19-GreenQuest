// JS for student-submit-task.js

// Create empty arrays that store the names and URLs of imaged added to this task
var uploadedImageNames = [];
var uploadedImageURLs = [];


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
    if (uploadedImageNames.length == maxImages) {
        $("#upload-image-input").attr("disabled", "");
    } else if (uploadedImageNames.length == 0) {
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
        uploadedImageNames.push(imagePath);
        addPathsToDOM();
    });
}

/**
 * Write this
 */
function resetDOM() {
    var uploadedImages = document.getElementsByClassName('list-item');
    while (uploadedImages[0]) {
        uploadedImages[0].parentNode.removeChild(uploadedImages[0]);
    }
}

/**
 * Write this
 */
function addPathsToDOM() {
    resetDOM();
    for (var i = 0; i < uploadedImageNames.length; i++) {
        let imagePath = "<li class='list-item'><a class='uploaded-image' href='#'>" + uploadedImageNames[i] +
            "</a><img src='/img/remove_icon.png' class='remove-icon' id='delete-" + uploadedImageNames[i] + "' onclick='removeImage(this)'></li>";
        $(".uploaded-images").append(imagePath);
    }
    console.log(uploadedImageNames);
    checkNumUploaded();
    $("#upload-image-input").prop("value", null);
}

/**
 * Write this
 */
function removeImage(element) {
    let imageName = $(element).attr("id");
    imageName = imageName.replace("delete-","");
    let index = uploadedImageNames.indexOf(imageName);
    if (index >= 0) {
        uploadedImageNames.splice(index, 1);
    }
    addPathsToDOM();
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
