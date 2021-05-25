// JS for educator-approve-quest.js

var questIDs = [];
var currentUser = null;
var questID;
var userID;
var submitterID;
var submitterPoints;
var className;
var classPoints;
var questSubmitters = null;
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
                    getQuests();
                });
        }
    });
}

/**
 * Write this.
 */
function pullQuestInfo(id) {
    db.collection("Student_Quests").doc(id)
        .get()
        .then((doc) => {
            questSubmitters = doc.data().Quest_Submitters;
            submitterIDs = doc.data().Submitter_IDs;
            questDescription = doc.data().Quest_Description;
            questNotes = doc.data().Quest_Notes;
            imageURLs = doc.data().Quest_Images;
            // className = doc.data().Submitter_Class;
            // getSubmitterPoints();
            // getClassPoints();
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
    for (var i = 0; i < questSubmitters.length; i++) {
        let submitter = "<li>" + questSubmitters[i] + "</li>";
        $("#quest-submitters").append(submitter);
    }
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
    for (var i = 0; i < submitterIDs.length; i++) {
        db.collection("Students").doc(submitterIDs[i]).update({
            Student_Points: doc.data().Student_Points + questPoints
        })
            .then(() => {
                console.log("Student points updated successfully!");
                updateClassPoints(submitterIDs[i]);
            })
            .catch((error) => {
                console.error("Error updating student points: ", error);
            });
    }
}

/**
 * Write this.
 */
function updateClassPoints(id) {
    db.collection("Students").doc(id)
        .get()
        .then(function (doc) {
            let className = doc.data().Student_Class;
            db.collection("Classes").doc(className).update({
                Class_Points: doc.data().Class_Points + questPoints
            })
                .then(() => {
                    console.log("Class points successfully updated!");
                })
                .catch((error) => {
                    console.error("Error updating class points: " + error);
                })
        });
}

/**
 * Write this.
 */
function approveStudentQuest() {
    questPoints = document.getElementById("quest-points-input").value;
    questPoints = parseInt(questPoints);
    db.collection("Student_Quests").doc(questID).update({
        Quest_Status: "approved",
        Quest_Unread: true,
        Quest_Points: questPoints,
        Date_Processed: new Date(),
        Date_Submitted: firebase.firestore.FieldValue.delete(),
        // Quest_Likes: 0
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
    db.collection("Student_Quests").doc(questID).update({
        Quest_Status: "rejected",
        Unread: true,
        Quest_Points: 0,
        Date_Processed: new Date(),
        Date_Submitted: firebase.firestore.FieldValue.delete(),
        // Quest_Likes: 0
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
        approveStudentQuest();
        if (imageURLs.length != 0) {
            deleteStoredImages();
        }
        displaySuccessMessage();
    }
}

/**
 * Write this
 */
function onClickReject() {
    rejectStudentQuest();
    if (imageURLs.length != 0) {
        deleteStoredImages();
    }
    displaySuccessMessage();
}

/**
 * Write this
 */
function displaySuccessMessage() {
    $("#feedback").html("Success! Please wait...");
    $("#feedback").css({
        color: "green"
    });
    $("#feedback").show(0);
    $("#feedback").fadeOut(1000);
    setTimeout(function () {
        // Refresh the page (will be redirected if there are no more quests to approve)
        location.reload();
    }, 2300);
}

/**
//  * Write this
//  */
// function listQuests() {
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             db.collection("Educators")
//                 .doc(user.uid)
//                 // Read
//                 .get()
//                 .then(function (doc) {
//                     currentUser = doc.id;
//                     console.log("Your firebase user ID is " + currentUser);
//                     getQuests();
//                 });
//         }
//     });
// }

/**
 * Reads quest IDs relevant to this user from Firestore and stores them in an array.
 */
function getQuests() {
    db.collection("Student_Quests")
        .where("Quest_Approver_ID", "==", userID)
        .orderBy("Date_Submitted", "asc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Quest_Status === "submitted") {
                    questIDs.push(doc.id);
                }
            });
            if (questIDs[0] == null) {
                location.href = "./educator-home.html";
            }
            questID = questIDs[0];
            for (var i = 0; i < questIDs.length; i++) {
                pullQuestInfo(questIDs[i]);
            }
        })
        .catch((error) => {
            console.log("Error getting quests: ", error);
        });
}

/**
 * Write this.
 * Taken from https://stackoverflow.com/questions/3252730/how-to-prevent-a-click-on-a-link-from-jumping-to-top-of-page
 */
$(".button").click(function (event) {
    event.preventDefault();
})

// Run function when document is ready 
$(document).ready(function () {
    getQuests();
});