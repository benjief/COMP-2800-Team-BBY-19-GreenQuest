// JS for educator-approve-quest.js


var questIDs = [];
var currentUser = null;
var questID;
var userID;
var submitterID;
var submitterPoints;
var className;
var classPoints;
var questSubmitter = null;
var questDescription = null;
var questNotes = null;
var questPoints = 0;

var validInput = false;

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
    if (questNotes === "" || questNotes == null) {
        var notes = "<p id='quest-notes'>none</p>";
    } else {
        var notes = "<p id='quest-notes'>" + questNotes + "</p>";
    }
    $("#quest-notes-container").append(notes);
    if (imageURLs.length == 0) {
        var imageDOM = "<li class='list-item'>none</li>";
    } else {
        for (var i = 0; i < imageURLs.length; i++) {
            var imageDOM = "<li class='list-item'><a class='uploaded-image' id='" +
                imageURLs[i] + "' data-bs-toggle='modal' data-bs-target='#imagePreview' onclick='showPreview(this)'>Image " +
                (i + 1) + "</li>";
        }
    }
    $(".uploaded-images").append(imageDOM);
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
 * Write this.
 * 
 */
function deleteStoredImages() {
    let storageRef = storage.ref();
    for (var i = 0; i < imageURLs.length; i++)
        deleteRef = imageURLs[i].replace("https://firebasestorage.googleapis.com/v0/b/greenquest-"
            + "5f80c.appspot.com/o/images%2Fquests%2F", "");
    deleteRef = deleteRef.substr(0, deleteRef.indexOf("?"));
    deleteRef = storageRef.child("images/quests/" + deleteRef);
    deleteRef.delete()
        .then(() => {
            console.log("Processed image successfully removed from storage!");
        })
        .catch((error) => {
            console.error("Error deleting processed image from storage: ", error);
        });
}

/**
 * Write this.
 */
function updateStudentPoints() {
    submitterPoints += questPoints;
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
    classPoints += questPoints;
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
    questPoints = document.getElementById("quest-points-input").value;
    questPoints = parseInt(questPoints);
    db.collection("Students").doc(submitterID).collection("Quests").doc(questID).update({
        Quest_Status: "approved",
        Unread: true,
        Quest_Points: questPoints,
        Date_Processed: new Date(),
        Date_Submitted: firebase.firestore.FieldValue.delete(),
        Quest_Likes: 0
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
        Unread: true,
        Quest_Points: 0,
        Date_Processed: new Date(),
        Date_Submitted: firebase.firestore.FieldValue.delete(),
        Quest_Likes: 0
    })
        .then(() => {
            console.log("Student quest successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student quest: " + error);
        })
}

/**
 * Make sure the user has entered a point value for an approved task.
 * 
 */
function checkInput() {
    if ($("#quest-points-input").prop("value") == null || $("#quest-points-input").prop("value").length == 0) {
        $("#feedback").html("Enter a point value");
        $("#feedback").css({
            color: "red"
        });
        $("#feedback").show(0);
        $("#feedback").fadeOut(2000);
    } else {
        validInput = true;
    }
}

/**
 * Write this
 */
function onClickApprove() {
    checkInput();
    if (validInput) {
        db.collection("Educators").doc(userID).collection("Quests").doc(questID).delete()
            .then(() => {
                console.log("Quest successfully approved!");
                approveStudentQuest();
                if (imageURLs.length != 0) {
                    deleteStoredImages();
                }
                $("#feedback").html("Success! Please wait...");
                $("#feedback").css({
                    color: "green"
                });
                $("#feedback").show(0);
                $("#feedback").fadeOut(1000);
                setTimeout(function () {
                    location.reload();
                }, 2300);
            })
            .catch((error) => {
                console.error("Error approving quest: ", error);
            })
    }
}

/**
 * Write this
 */
function onClickReject() {
    db.collection("Educators").doc(userID).collection("Quests").doc(questID).delete()
        .then(() => {
            console.log("Quest successfully rejected!");
            rejectStudentQuest();
            if (imageURLs.length != 0) {
                deleteStoredImages();
            }
            $("#feedback").html("Success! Please wait...");
            $("#feedback").show(0);
            $("#feedback").fadeOut(2500);
            setTimeout(function () {
                location.reload();
            }, 2300);
        })
        .catch((error) => {
            console.error("Error rejecting quest: ", error);
        })
}

/**
 * Write this
 */
function listQuests() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.id;
                    console.log("Your firebase user ID is " + currentUser);
                    getQuests();
                });
        }
    });
}

/**
 * Reads quest IDs from Firestore and puts them into an array.
 */
function getQuests() {
    db.collection("Educators").doc(currentUser).collection("Quests")
        .orderBy("Date_Submitted", "asc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                questIDs.push(doc.id);
            });
            if (questIDs[0] == null) {
                location.href = "./educator-home.html";
            }
            console.log(questIDs[0]);
            questID = questIDs[0];
            console.log(questID)
            getCurrentUser();
        })
        .catch((error) => {
            console.log("Error getting quests: ", error);
        });
}

// Run function when document is ready 
$(document).ready(function () {
    listQuests();
});