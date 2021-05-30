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
var imageURLs = [];

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 500 milliseconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
function delayTimer() {
    setTimeout(removeSpinner, 1500);
}

/**
 * Sets the spinner's display to none.
 */
function removeSpinner() {
    document.getElementById("loader").style.display = "none";
}
// Run the delay timer 
delayTimer();

/* Gets the current user's ID from Firestore. */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
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
 * Pulls quests from Firestore whose Quest_Approver_IDs match the current educator's ID. This means that
 * the student who submitted the quest is part of this educator's class, making them the designated approver.
 * Pulled quests are ordered from oldest to newest, so that quests that have been queuing for approval longer 
 * are prioritized. Quests from the list of quest IDs populated here (questIDs) are loaded until the educator has
 * processed their entire backlog, at which time they are automatically redirected back to the educator homepage.
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
            // Redirect the user back to the educator homepage if there are no more quests left to process 
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
 * Pulls information contained in the curren't quest document's fields from Firestore. These fields include
 * the quest submitters' names, their IDs, the quest description, any quest notes written by the submitters, and 
 * any links to any images they uploaded to Cloud Storage and attached to this submission.
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
            populateDOM();
            getClassList();
        })
        .catch((error) => {
            console.log("Error getting quest: ", error);
        });
}

/**
 * Populates the DOM with the quest information retrieved above, so that the educator can
 * review the submission before approving or rejecting it.
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
            $(".uploaded-images").append(imageDOM);
        }
    }
}

/**
 * Pulls class IDs/names from Firestore (submitting student docs), and uses those IDs to go into the
 * Classes collection and pull each class' current point total. Class names and point totals are stored as 
 * JSON objects in the classList array.
 */
function getClassList() {
    console.log(submitterIDs);
    for (var i = 0; i < submitterIDs.length; i++) {
        db.collection("Students").doc(submitterIDs[i])
            .get()
            .then(function (doc) {
                let className = doc.data().Student_Class;
                if (className != null) {
                    db.collection("Classes").doc(className)
                        .get()
                        .then(function (doc) {
                            let classPoints = doc.data().Class_Points;
                            let classObject = { "name": className, "points": classPoints };
                            classList.push(classObject);
                        })
                }
            });
    }
}

/**
 * Opens up a modal to preview an image attached by a quest's submitters, if the educator clicks on that image's DOM link 
 * (all images submitted by the student - up to 3 are listed on the page as clickable links).
 * 
 * @param {*} element - The DOM element (image link) clicked on.
 */
function showPreview(element) {
    $(".modal-body").html("");
    let previewName = $(element).text();
    let previewURL = $(element).attr("id");
    console.log(previewName);
    console.log(previewURL);
    // A one-second timeout delay is included here before populating the modal, just because fetching delays were causing errors.
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
 * Toggles the "approve quest" function cascade when the educator clicks on the "Approve" button.
 */
$(document.body).on("click", "#approve-button", function (event) {
    checkInput();
    if (validInput) {
        approveStudentQuest();
        // If any images were attached to this quest, delete them from Cloud Storage
        if (imageURLs.length != 0) {
            deleteStoredImages();
        }
    }
});


/**
 * Pulls the point value input by the educator for this quest (in the "Points" field) and the quest that has just
 * been approved's fields in Firestore (Quest_Status, Quest_Points and Date_Processed; the Date_Submitted and Quest_Images fields are removed). 
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
        Quest_Images: firebase.firestore.FieldValue.delete()
    })
        .then(() => {
            console.log("Student quest successfully updated!");
            for (var i = 0; i < submitterIDs.length; i++) {
                updateStudentPoints(submitterIDs[i]);
            }
            getClassNames();
        })
        .catch((error) => {
            console.error("Error updating student quest: " + error);
        })
}


/**
 * Toggles the "approve quest" function cascade when the educator clicks on the "Approve" button.
 */
$(document.body).on("click", "#reject-button", function (event) {
    rejectStudentQuest();
    if (imageURLs.length != 0) {
        deleteStoredImages();
    }
});

/**
 * Makes sure the user has entered a point value for an approved task. If they haven't, an error message
 * is displayed and the "approve task" function cascade is halted.
 */
function checkInput() {
    // Check to see if the (numeric) points input field contains a value
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
 * Updates the quest that has just been rejected's fields in Firestore (Quest_Status, Quest_Points and Date_Processed; 
 * the Date_Submitted and Quest_Images fields are removed). 
 */
function rejectStudentQuest() {
    db.collection("Student_Quests").doc(questID).update({
        Quest_Status: "rejected",
        Quest_Points: 0,
        Date_Processed: new Date(),
        Date_Submitted: firebase.firestore.FieldValue.delete(),
        Quest_Images: firebase.firestore.FieldValue.delete()
    })
        .then(() => {
            console.log("Student quest successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student quest: " + error);
        })
}

/**
 * Updates the Student_Points field of each submitting student attached to this quest in Firestore. Each submitting 
 * student will have the points specified by the approving educator added to the point value already stored in this field.
 * 
 * @param {*} id - The ID of the student document to be updated (stored in submitterIDs).
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
 * Returns the occurrence of a specified value contained in an array.
 * @author Donald Duck
 * @see https://stackoverflow.com/questions/37365512/count-the-number-of-times-a-same-value-appears-in-a-javascript-array
 * 
 * @param {*} array - The array containing the value whose occurrence (in said array) is of interest.
 * @param {*} value - The value whose occurrence is of interest.
 * @returns  - An integer representing the occurrence of the specified value in the specified array.
 */
function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}

/**
 * Creates an array containing the names of all classes whose point totals need to be updated during this 
 * approval. Because multiple submitters may belong to the same class, classNames can contain repeating entries.
 */
function getClassNames() {
    let classNames = [];
    for (var i = 0; i < classList.length; i++) {
        classNames.push(classList[i].name);
    }
    getPointsToAdd(classNames);
}

/**
 * Calculates the number of points that should be added to each class, based on the occurrence of the class in 
 * classList and the point value entered for this approval by the educator. For example, if a class is listed twice and
 * the educator has valued this submission at 10 points (allocated to each student), then that class should have 20 points
 * added to its total. These numbers are stored (along with class names)  in pointsToAdd, which can still contain multiple entries.
 * 
 * @param {*} classNames - An array containing the names of all classes relevant to this submission (can contain repeating entries).
 */
function getPointsToAdd(classNames) {
    let pointsToAdd = [];
    for (var i = 0; i < classNames.length; i++) {
        // Get the occurrence of classNames[i] in classNames
        let classOccurrence = getOccurrence(classNames, classNames[i]);
        let classObject = { "name": classNames[i], "points": classOccurrence * questPoints };
        pointsToAdd.push(classObject);
    }
    getUpdatedClassPoints(pointsToAdd);
}

/**
 * Takes the number of points each class currently possesses (before any points are added for this quest approval) and adds those
 * to the number of points that class should accrue from this approval. This is a lot more complicated a function than I thought I 
 * would need to write for such a seemingly simple task. However, the database structure I chose and Firestore's inability to loop
 * over a list in order made it necessary.
 * 
 * @param {*} pointsToAdd - An array containing the names and points to be added for all classes relevant to this submission (can
 *                          contain repeating entries)
 */
function getUpdatedClassPoints(pointsToAdd) {
    let classNames = []
    // The array that will store each class' updated point total (once current and earned points are summed)
    let updatedClassPoints = [];

    for (var i = 0; i < classList.length; i++) {
        // Current and earned points are summed for each class
        let updatedPoints = classList[i].points + pointsToAdd[i].points;
        let updatedClassObject = { "name": classList[i].name, "points": updatedPoints };
        // Here, any repetition is taken care of by checking against a list of class names
        if (!classNames.includes(classList[i].name)) {
            updatedClassPoints.push(updatedClassObject);
            /* The name of the class just processed is added to this list, so that if that class is later
               repeated, it won't be pushed to updatedClassPoints. */
            classNames.push(classList[i].name);
        }
    }

    for (var i = 0; i < updatedClassPoints.length; i++) {
        updateClassPoints(updatedClassPoints[i]);
    }
}

/**
 * Updates the "Class_Points" field of each class that has garnered points in this quest approval (i.e. each class represented by
 * a submitting student attached to this quest) using the point values calculated above.
 * 
 * @param {*} studentClass - The JSON class object containing the name of each class to be updated and the point value to update.
 */
function updateClassPoints(studentClass) {
    db.collection("Classes").doc(studentClass.name).update({
        Class_Points: studentClass.points
    })
        .then(() => {
            console.log("Class points successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating class points: " + error);
        });
}

/**
 * Deletes any images written to Cloud Storage as part of this submission. This function chops up the download URLs stored in
 * imageURLs (which were initially stored in the Quest_Images field [in Firestore] of the task being processed) to create a 
 * deletion reference. This reference is then used to remove the submitted images from the Cloud.
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
            // Display a message to let the educator know the process has completed successfully
            displaySuccessMessage();
        })
        .catch((error) => {
            console.error("Error removing processed image from storage: ", error);
        });
}

/**
 * Displays a success message to the screen once the function cascade for processing a quest (approving or rejecting)
 * is complete. After this message has been displayed, the page reloads.
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
 * Prevents the page from jumping upwards when a user clicks on the "Approve" button. This way,
 * any feedback pushed to the DOM can be seen without quickly scrolling back down again.
 */
$("#card-button-container-1 a").click(function (event) {
    event.preventDefault();
})

/**
 * Prevents the page from jumping upwards when a user clicks on the "Reject" button. This way,
 * any feedback pushed to the DOM can be seen without quickly scrolling back down again.
 */
$("#card-button-container-2 a").click(function (event) {
    event.preventDefault();
})

/**
 * Calls getCurrentStudent() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentUser();
});
