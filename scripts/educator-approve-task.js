
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
            submitterID = doc.data().Submitter_ID;
            taskDescription = doc.data().Task_Description;
            taskNotes = doc.data().Task_Notes;
            imageURLs = doc.data().Task_Photos;
            populateDOM();
        })
        .catch((error) => {
            console.log("Error getting task: ", error);
        });
}

/**
 * Write this.
 */
function populateDOM() {
    let submitter = "<p id='task-submitter'>" + taskSubmitter + "</p>";
    $("#task-submitter-container").append(submitter);
    let description = "<p id='task-description'>" + taskDescription + "</p>";
    $("#task-description-container").append(description);
    let notes = "<p id='task-notes'>" + taskNotes + "</p>";
    $("#task-notes-container").append(notes);
    for (var i = 0; i < imageURLs.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' id=image'"
            + imageURLs[i] + "' data-bs-toggle='modal' data-bs-target='#imagePreview' onclick='showPreview(this)'>Image "
            + (i + 1) + "</li>";
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
function deleteStoredImages() {
    let storageRef = storage.ref();
    for (var i = 0; i < imageURLs.length; i ++)
    deleteRef = storageRef.child(imageURLs[i]);
    deleteRef.delete()
        .then(() => {
            console.log("Approved image successfully removed from storage!");
        })
        .catch((error) => {
            console.error("Error deleting approved image from storage: ", error);
        });
}

/**
 * Write this.
 */
function approveStudentTask() {
    db.collection("Students").doc(submitterID).collection("Tasks").doc(taskID).update({
        Task_Approved: true
    })
        .then(() => {
            console.log("Student task successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student task: " + error);
        })
}

/**
 * Write this.
 */
function rejectStudentTask() {
    db.collection("Students").doc(submitterID).collection("Tasks").doc(taskID).update({
        Task_Rejected: true
    })
        .then(() => {
            console.log("Student task successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student task: " + error);
        })
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
    deleteStoredImages();
}

/**
 * Write this
 */
function onClickReject() {
    db.collection("Educators").doc(userID).collection("Tasks").doc(taskID).update({
        Task_Rejected: true
    })
        .then(() => {
            console.log("Task successfully rejected!");
            rejectStudentTask();
        })
        .catch((error) => {
            console.error("Error rejecting task: ", error);
        })
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();
});
