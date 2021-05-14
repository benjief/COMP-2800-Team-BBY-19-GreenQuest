
// JS for educator-approve-task.js

// Pull class name and ID from URL
const parsedUrl = new URL(window.location.href);
var taskName = parsedUrl.searchParams.get("taskname");
var taskID = parsedUrl.searchParams.get("taskid");
$(".page-heading").html(taskName);

var userID;
var submitterID;
var taskSubmitter = null;
var taskDescription = null;
var taskNotes = null;
var taskPoints = 0;
var taskApproved = false;

// Create an empty array to store URLs of images attached to this task
var imageURLs = [];

/* Get the current user's ID from Firestore. */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current user's ID
                    userID = doc.id;
                    pullTaskInfo();
                });
        }
    });
}

/**
 * Write this.
 */
function pullTaskInfo() {
    db.collection("Educators").doc(userID).collection("Tasks").doc(taskID)
        .get()
        .then((doc) => {
            taskSubmitter = doc.data().Task_Submitter;
            taskDescription = doc.data().Task_Description;
            taskNotes = doc.data().Task_Notes;
            imageURLs = doc.data().Task_Photos;
            pupulateDOM();
        })
        .catch((error) => {
            console.log("Error getting task: ", error);
        });
}

function populateDOM() {
    let taskSubmitter = "<p id='task-submitter'>" + taskSubmitter + "</p>";
    $("#task-submitter-container").append(taskSubmitter);
    let taskDescription = "<p id='task-description'>" + taskDescription + "</p>";
    $("#task-description-container").append(taskDescription);
    let taskNotes = "<p id='task-notes'>" + taskNotes + "</p>";
    $("#task-notes-container").append(taskNotes);
    for (var i = 0; i < imageURLs.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' id=image'"
            + imageURLs[i] + "' data-bs-toggle='modal' data-bs-target='#imagePreview' onclick='showPreview(this)'>Image"
            + i + "</li>";
        $(".uploaded-images").append(imageDOM);
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
        let previewName = $(element).html;
        let previewURL = $(element).attr("id");

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
 * Write this.
 */
function approveStudentTask() {
    db.collection("Students").doc(taskSubmitter).
}

/**
 * Write this
 */
function onClickApprove() {
    db.collection("Educators").doc(userID).collection("Tasks").doc(taskID).delete()
    .then(() => {
        console.log("Task successfully approved!");
        approveStudentTask();
    })
    .catch((error) => {
        console.error("Error approving task: ", error);
    })
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
