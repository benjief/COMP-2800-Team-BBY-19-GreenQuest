// JS for student-submit-task.js

var userName;
var className;
var userID;

// Create an empty array to store files added to this task
var uploadedImageFiles = [];

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
    let message = "<div class='text-container'><p class='message'>You haven't uploaded any images</p></div>"
    if (uploadedImageFiles.length == maxImages) {
        $("#upload-image-input").attr("disabled", "");
    } else if (uploadedImageFiles.length == 0) {
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
        uploadedImageFiles.push(event.target.files[0]);
        // var imagePath = event.target.files[0].name;
        // uploadedImageNames.push(imagePath);
        addNamesToDOM();
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
function addNamesToDOM() {
    resetDOM();
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' href='#'>" + uploadedImageFiles[i].name +
            "</a><img src='/img/remove_icon.png' class='remove-icon' id='delete-" + uploadedImageFiles[i].name
            + "' onclick='removeImage(this)'></li>";
        $(".uploaded-images").append(imageDOM);
    }
    checkNumUploaded();
    $("#upload-image-input").prop("value", null);
}

/**
 * Write this
 */
function removeImage(element) {
    let imageName = $(element).attr("id");
    imageName = imageName.replace("delete-", "");
    let index = null;
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        if (uploadedImageFiles[i].name === imageName) {
            index = i;
        }
    }
    if (index >= 0) {
        uploadedImageNames.splice(index, 1);
    }
    addNamesToDOM();
}

/**
 * CITE and write
 */
function getStorageRef(file) {
    let imageID = file.lastModified;
    // Create a storage reference and keep track of it
    var storageRef = storage.ref("images/tasks/" + imageID + ".jpg");
    return storageRef;
}

/* Get the current user's class name and ID from Firestore. */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current student's class name
                    userName = doc.data().Student_Name;
                    className = doc.data().Student_Class;
                    userID = doc.id;
                    if (className == null) {
                        let message = "<div class='text-container'><p class='message'>You haven't uploaded any images</p></div>"
                        $(".upload-images").append(message);
                        $("#submit-button").remove();
                    }
                });
        }
    });
}

/**
 * CITE and write this 
 * (https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript?page=1&tab=votes#tab-top)
 */
function pseudorandomID() {
    let generatedID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    return generatedID;
}

/**
 * Write this
 * 
 * @param {*} imageURLs 
 */
function addTaskToDB(imageURLs) {
    // Write task to student's task collection
    db.collection("Students").doc(userID).collection("Tasks").doc(taskID).set({
        Task_Submitter: userName,
        Task_Description: "Test",
        Task_Photos: imageURLs,
        Task_Notes: $("#task-notes").prop("value")
    }) 
    // Write task to teacher's task collection
}


/**
 * CITE and write this
 */
function onClickSubmit() {
    let imageURLs = [];
    // Generate image URLs and add them to an array
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let storageRef = getStorageRef(uploadedImageFiles[i]);
        let taskID = pseudorandomID();
        storageRef.put(file)
            .then(function () {
                console.log('Uploaded to Cloud storage');
            });
        storageRef.getDownloadURL()
            .then(function (url) {
                console.log(url);
                imageURLs.push(url);
            })
    }
    /* Create task documents in the student's and their teacher's task collection 
    (include array of image URLs as an attribute) */
    addTaskToDB(imageURLs);
}

// Run function when document is ready 
$(document).ready(function () {
    checkNumUploaded();
    processImage();
});
