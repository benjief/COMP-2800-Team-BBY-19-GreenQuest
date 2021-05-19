
// JS for educator-approve-quest.js

// Pull quest name and ID from URL
const parsedUrl = new URL(window.location.href);
var questName = parsedUrl.searchParams.get("questname");
var questID = parsedUrl.searchParams.get("questid");
$(".page-heading").html(questName);

var userID;
var submitterID;
var submitterPoints;
var className;
var classPoints;
var questSubmitter = null;
var questDescription = null;
var questNotes = null;
var questPoints = 0;

// Create an empty array to store URLs of images attached to this quest
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
                    pullQuestInfo();
                });
        }
    });
}

/**
 * Write this.
 */
function pullQuestInfo() {
    db.collection("Educators").doc(userID).collection("Quests").doc(questID)
        .get()
        .then((doc) => {
            questSubmitter = doc.data().Quest_Submitter;
            submitterID = doc.data().Submitter_ID;
            questDescription = doc.data().Quest_Description;
            questNotes = doc.data().Quest_Notes;
            imageURLs = doc.data().Quest_Photos;
            className = doc.data().Submitter_Class;
            getSubmitterPoints();
            getClassPoints();
            populateDOM();
        })
        .catch((error) => {
            console.log("Error getting quest: ", error);
        });
}

/**
 * Write this.
 */
 function getSubmitterPoints() {
    db.collection("Students").doc(submitterID)
        .get()
        .then((doc) => {
            submitterPoints = doc.data().Student_Points;
            console.log(submitterPoints);
        })
        .catch((error) => {
            console.log("Error getting submitter points: ", error);
        });
}

/**
 * Write this.
 */
 function getClassPoints() {
    db.collection("Classes").doc(className)
        .get()
        .then((doc) => {
            classPoints = doc.data().Class_Points;
            console.log(classPoints);
        })
        .catch((error) => {
            console.log("Error getting class points: ", error);
        });
}

/**
 * Write this.
 */
function populateDOM() {
    let submitter = "<p id='quest-submitter'>" + questSubmitter + "</p>";
    $("#quest-submitter-container").append(submitter);
    let description = "<p id='quest-description'>" + questDescription + "</p>";
    $("#quest-description-container").append(description);
    let notes = "<p id='quest-notes'>" + questNotes + "</p>";
    $("#quest-notes-container").append(notes);
    for (var i = 0; i < imageURLs.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' id='"
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
    let previewName = $(element).text();
    let previewURL = $(element).attr("id");
    console.log(previewName);
    console.log(previewURL);
    setTimeout(() => {
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
        storageRef = storageRef.child("images/quests/" + imageID + ".jpg");
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
    for (var i = 0; i < imageURLs.length; i++)
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
function updateStudentPoints() {
    let pointsGained = document.getElementById("quest-points-input").value;
    pointsGained = parseInt(pointsGained);
    console.log(pointsGained);
    submitterPoints += pointsGained;
    console.log(submitterPoints);
    db.collection("Students").doc(submitterID).update({
        Student_Points: submitterPoints
    })
    .then(() => {
        console.log("Student points updated successfully!");
    })
    .catch((error) => {
        console.error("Error updating student points: ", error);
    });
}

/**
 * Write this.
 */
function updateClassPoints() {
    classPoints += submitterPoints;
    console.log(classPoints);
    db.collection("Classes").doc(className).update({
        Class_Points: classPoints
    })
    .then(() => {
        console.log("Class points successfully updated!");
    })
    .catch((error) => {
        console.error("Error updating class points: " + error);
    })
}

/**
 * Write this.
 */
function approveStudentQuest() {
    db.collection("Students").doc(submitterID).collection("Quests").doc(questID).update({
        Quest_Status: "approved",
        Unread: true,
        Quest_Points: questPoints
    })
        .then(() => {
            console.log("Student quest successfully updated!");
            updateStudentPoints();
            updateClassPoints();
        })
        .catch((error) => {
            console.error("Error updating student quest: " + error);
        })
}

/**
 * Write this.
 */
function rejectStudentQuest() {
    db.collection("Students").doc(submitterID).collection("Quests").doc(questID).update({
        Quest_Status: "rejected",
        Unread: true
    })
        .then(() => {
            console.log("Student quest successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student quest: " + error);
        })
}

/**
 * Write this
 */
function onClickApprove() {
    db.collection("Educators").doc(userID).collection("Quests").doc(questID).delete()
        .then(() => {
            console.log("Quest successfully approved!");
            approveStudentQuest();
            // deleteStoredImages();
            $("#feedback").html("Success! Please wait...");
            $("#feedback").show(0);
            $("#feedback").fadeOut(2500);
            setTimeout(function () {
                location.href = "./educator-home.html";
            }, 2300);
        })
        .catch((error) => {
            console.error("Error approving quest: ", error);
        })
}

/**
 * Write this
 */
function onClickReject() {
    db.collection("Educators").doc(userID).collection("Quests").doc(questID).update({
        Quest_Rejected: true
    })
        .then(() => {
            console.log("Quest successfully rejected!");
            rejectStudentQuest();
            $("#feedback").html("Success! Please wait...");
            $("#feedback").show(0);
            $("#feedback").fadeOut(2500);
            setTimeout(function () {
                location.href = "./educator-home.html";
            }, 2300);
        })
        .catch((error) => {
            console.error("Error rejecting quest: ", error);
        })
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();
});
