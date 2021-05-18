
// JS for student-submit-task.js

// Pull task and user IDs from URL
const parsedUrl = new URL(window.location.href);
var taskID = parsedUrl.searchParams.get("taskid");
var userID = parsedUrl.searchParams.get("userid");

var userName;
var className;
var educatorName;
var educatorID;
var taskDescription;
var uniqueTaskID;

// Create empty arrays to store files added to this task and their URLs
var uploadedImageFiles = [];
var imageURLs = [];

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
    if (className) {
        let message = "<div class='text-container'><p class='message'>You haven't uploaded any images</p></div>"
        if (uploadedImageFiles.length == maxImages) {
            $("#upload-image-input").attr("disabled", "");
        } else if (uploadedImageFiles.length == 0) {
            $(".uploaded-images").append(message);
        } else {
            $("#upload-image-input").removeAttr("disabled");
            if ($(".message")) {
                $(".message").remove();
            }
        }
    }
}
/**
 * Write this.
 */
function storeTemporaryImage(image) {
    $("#" + image.name).attr("data-target", "modalCenter");
    let storageRef = getStorageRef(image, true);
    storageRef.put(image)
        .then(function () {
            console.log('Uploaded to temp Cloud storage');
            storageRef.getDownloadURL()
                .then(function (url) {
                    console.log(url);
                    image.tempURL = url;
                })
        });
}

/**
 * CITE - Write this.
 */
function processImage() {
    const imageInput = document.getElementById("upload-image-input");
    imageInput.addEventListener('change', function (event) {
        console.log(event.target.files[0]);
        uploadedImageFiles.push(event.target.files[0]);
        storeTemporaryImage(event.target.files[0]);
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
 * Write this.
 * 
 * @param {*} element 
 */
function showPreview(element) {
    $(".modal-body").html("");
    setTimeout(() => {
        let previewName = null;
        let previewURL = null;
        // console.log(uploadedImageFiles);
        // console.log($(element).attr("id"));
        // console.log($(element).attr("id") == uploadedImageFiles[0].name);
        // console.log(uploadedImageFiles[0].tempURL);
        for (var i = 0; i < uploadedImageFiles.length; i++) {
            if (uploadedImageFiles[i].name == $(element).attr("id")) {
                previewName = uploadedImageFiles[i].name;
                previewURL = uploadedImageFiles[i].tempURL;
            }
        }
        if (previewName) {
            $(".modal-title").html(previewName);
            $(".modal-body").html("<img src='" + previewURL + "'>");
        } else {
            $(".modal-title").html("No preview available");
            $(".modal-body").html("Sorry, we couldn't generate a preview for you.");
        }
    }, 1000);
}

/**
 * Write this
 */
function addNamesToDOM() {
    resetDOM();
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' id='"
            + uploadedImageFiles[i].name + "' data-bs-toggle='modal' data-bs-target='#imagePreview' onclick='showPreview(this)'>"
            + uploadedImageFiles[i].name + "</a><img src='/img/remove_icon.png' class='remove-icon' id='delete-"
            + uploadedImageFiles[i].name + "' onclick='removeImage(this)'></li>";
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
        uploadedImageFiles.splice(index, 1);
    }
    addNamesToDOM();
}

/**
 * CITE and write
 */
function getStorageRef(file, temp) {
    let imageID = file.lastModified;
    // Create a storage reference
    let storageRef = storage.ref();
    if (!temp) {
        storageRef = storageRef.child("images/tasks/" + imageID + ".jpg");
    } else {
        storageRef = storageRef.child("images/temp/" + imageID + ".jpg");
    }
    return storageRef;
}

/* Get the current user's name, class name, educator name, and ID from Firestore. */
function getCurrentStudent() {
    db.collection("Students").doc(userID)
        .get()
        .then(function (doc) {
            // Extract the current student's class name
            userName = doc.data().Student_Name;
            className = doc.data().Student_Class;
            educatorName = doc.data().Student_Educator;
            if (className == null) {
                let message = "<div class='text-container'><p class='message'>You haven't been added to a class yet</p></div>"
                $(".uploaded-images").append(message);
                $("#card-button-container-1").remove();
                $("#upload-image-input").attr("disabled", "");
                $("#task-notes").attr("disabled", "");
                $("#task-notes").attr("placeholder", "Ask your teacher to add you to their class to start getting tasks");
            }
            getTaskDescription();
            getUniqueTaskID();
            checkNumUploaded();
            getEducatorID();
            processImage();
        });
}

/**
 * Write this
 */
function getEducatorID() {
    db.collection("Educators")
        .where("Educator_Name", "==", educatorName)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                educatorID = doc.id;
            })
        })
        .catch((error) => {
            console.log("Error getting educator ID: ", error);
        });
}

/**
 * Write this.
 */
function getTaskDescription() {
    console.log(taskID);
    db.collection("Tasks").doc(taskID)
        .get()
        .then(function (doc) {
            taskDescription = doc.data().description;
            console.log("Task description successfully retrieved");
        })
        .catch((error) => {
            console.error("Error retrieving task description: ", error);
        });
}

/**
 * Write this.
 */
function getUniqueTaskID() {
    db.collection("Students").doc(userID).collection("Tasks")
    .where("Task_Submitted", "==", false)
    .get()
    .then((querySnapshot) => {
        // There should only ever be one task at a time
        querySnapshot.forEach((doc) => {
            uniqueTaskID = doc.id;
        })
    })
    .catch((error) => {
        console.log("Error getting unique task ID: ", error);
    });
}


/**
 * Write this
 */
function updateQuestStatus() {
    db.collection("Students").doc(userID).update({
        Student_Quest: false
    })
        .then(() => {
            console.log("Student quest status succesfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student quest status: ", error);
        });
}

/**
 * Write this.
 * 
 * @param {*} imageURLs 
 */
function addTaskToDB(imageURLs) {
    // Update task in student's task collection
    db.collection("Students").doc(userID).collection("Tasks").doc(uniqueTaskID).update({
        Task_Submitted: true
    })
        .then(() => {
            console.log("Student task successfully updated!");
            updateQuestStatus();
            // Write task to teacher's task collection
            db.collection("Educators").doc(educatorID).collection("Tasks").doc(uniqueTaskID).set({
                Task_Submitter: userName,
                Submitter_ID: userID,
                Task_Description: taskDescription,
                Task_Photos: imageURLs,
                Task_Notes: $("#task-notes").prop("value"),
            })
                .then(() => {
                    console.log("Educator task successfully written!");
                    $("#feedback").html("Success! Please wait...");
                    $("#feedback").show(0);
                    $("#feedback").fadeOut(2500);
                    setTimeout(function () {
                        location.href = "./student-home.html";
                    }, 2300);
                })
                .catch((error) => {
                    console.error("Error adding educator task: ", error);
                });
        })
        .catch((error) => {
            console.error("Error updating student task: ", error);
        });
}

/**
 * Write this.
 * 
 */
function deleteTempImages() {
    let storageRef = storage.ref();
    deleteRef = storageRef.child("images/temp");
    deleteRef.listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {
                itemRef.delete();
            });
        })
        .catch((error) => {
            console.error("Error deleting temp images: ", error);
        });
}

/**
 * CITE and write this
 */
function onClickSubmit() {
    // Generate image URLs and add them to an array
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let storageRef = getStorageRef(uploadedImageFiles[i], false);
        console.log(storageRef);
        storageRef.put(uploadedImageFiles[i])
            .then(function () {
                console.log('Uploaded to Cloud storage');
                storageRef.getDownloadURL()
                    .then(function (url) {
                        console.log(url);
                        imageURLs.push(url);
                        console.log(imageURLs);
                        /* Once list of permanent URLs is complete, create task documents in the student's and 
                           their teacher's task collection (include array of image URLs as an attribute) */
                        if (i == (uploadedImageFiles.length)) {
                            addTaskToDB(imageURLs);
                        };
                    })
            });
        console.log(uploadedImageFiles[i]);
        // deleteTempImages(uploadedImageFiles[i]);
    }
    deleteTempImages();
}

/**
 * CITE and write this
 */
function onClickHome() {
    // for (var i = 0; i < uploadedImageFiles.length; i++) {
    //     deleteTempImages(uploadedImageFiles[i]);
    // }
    deleteTempImages();
    location.href = "./student-home.html";
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
});
