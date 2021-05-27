// JS for educator-approve-quest.js

var questIDs = [];
var questID;
var userID;
var className;
var classPoints;
var questSubmitters = null;
var questDescription = null;
var questNotes = null;
var questPoints = 0;
var classList = [];

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
            questSubmitters = doc.data().Quest_Participants;
            submitterIDs = doc.data().Quest_Participant_IDs;
            questDescription = doc.data().Quest_Description;
            questNotes = doc.data().Quest_Notes;
            imageURLs = doc.data().Quest_Images;
            // className = doc.data().Submitter_Class;
            // getSubmitterPoints();
            // getClassPoints();
            populateDOM();
            getClassList();
        })
        .catch((error) => {
            console.log("Error getting quest: ", error);
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
            console.error("Error removing processed image from storage: ", error);
        });
}

/**
 * Write this.
 */
function updateStudentPoints(id) {
    console.log(id);
    console.log(id === "68KLrNzUySUsHchhyhiD0zlqRih1");
    db.collection("Students").doc(id)
        .get()
        .then(function (doc) {
            let updatedStudentPoints = doc.data().Student_Points + questPoints;
            db.collection("Students").doc(id).update({
                Student_Points: updatedStudentPoints
            })
                .then(() => {
                    console.log("Student points updated successfully!");
                })
                .catch((error) => {
                    console.error("Error updating student points: ", error);
                });
        })
}

/**
 * Write this.
 * Taken from https://stackoverflow.com/questions/37365512/count-the-number-of-times-a-same-value-appears-in-a-javascript-array
 * 
 * @param {*} array 
 * @param {*} value 
 * @returns 
 */
function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}

/**
 * Write this.
 */
function updateClassPoints() {
    console.log(classList);
    let classPointsList = [];
    for (var i = 0; i < classList.length; i++) {
        let points = getOccurrence(classList, classList[i]) * questPoints;
        let classPoints = { "name": classList[i], "points": points };
        if (!classPointsList.includes(classPoints)) {
            classPointsList.push(classPoints);
        }
        console.log(classPointsList);
    }

    for (var i = 0; i < classPointsList.length; i++) {
        db.collection("Classes").doc(classPointsList[i].name).update({
            Class_Points: classPointsList[i].points
        })
            .then(() => {
                console.log("Class points successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating class points: " + error);
            });
    }
}

/**
 * Write this.
 */
function getClassList() {
    console.log(submitterIDs);
    for (var i = 0; i < submitterIDs.length; i++) {
        db.collection("Students").doc(submitterIDs[i])
            .get()
            .then(function (doc) {
                let className = doc.data().Student_Class;
                if (className != null) {
                    classList.push(className);
                }
            });
    }
}


/**
 * Write this.
 */
function approveStudentQuest() {
    questPoints = document.getElementById("quest-points-input").value;
    questPoints = parseInt(questPoints);
    console.log(questID);
    db.collection("Student_Quests").doc(questID).update({
        Quest_Status: "approved",
        Quest_Points: questPoints,
        Date_Processed: new Date(),
        Date_Submitted: firebase.firestore.FieldValue.delete(),
        // Quest_Likes: 0
    })
        .then(() => {
            console.log("Student quest successfully updated!");
            for (var i = 0; i < submitterIDs.length; i++) {
                updateStudentPoints(submitterIDs[i]);
            }
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
    }, 1000);
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
                console.log("no more quests to process");
                location.href = "./educator-home.html";
            }
            questID = questIDs[0];
            pullQuestInfo(questID);
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
    getCurrentUser();
});

//Load Timer
//Taken from https://www.w3schools.com/howto/howto_css_loader.asp
function delayTimer() {
    setTimeout(removeSpinner, 1500);
  }
  
  function removeSpinner() {
    document.getElementById("loader").style.display = "none";
  }
  delayTimer();
