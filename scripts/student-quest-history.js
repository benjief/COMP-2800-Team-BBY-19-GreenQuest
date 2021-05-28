// JS for student-quest-history.html

var userID;

/**
 * Pulls the current user's ID from the "Students" collection in Firestore. 
 */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    // Extract the current user's ID
                    userID = doc.id;
                    checkProcessedQuests();
                    checkPendingQuests();
                });
        }
    });
}

/**
 * Searches the "Student_Quests" collection in Firestore for documents with Quest_Participant_IDs fields (arrays)
 * that contain the current student's userID (i.e. quests that the student was a participant in). The Quest_Status
 * field of each document (if any documents exist) is then searched for a value of "approved" or "rejected" (not 
 * "active" or "submitted" - the other possible values this field can take on). Any documents that make it through 
 * all of these filters will then increment a counter which acts as a flag for the student having a backlog of 
 * processed quests. This flag will then activate the "Processed Quests" button on this page.
 */
function checkProcessedQuests() {
    let counter = 0;
    db.collection("Student_Quests")
        .where("Quest_Participant_IDs", "array-contains", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                if (doc.data().Quest_Status == "approved" || doc.data().Quest_Status == "rejected") {
                    counter++;
                }
            })
            if (counter != 0) {
                enableProcessedQuests();
            }
        })
        .catch((error) => {
            console.log("Error getting processed quests: ", error);
        });
}

/**
 * Searches the "Student_Quests" collection in Firestore for documents with Quest_Participant_IDs fields (arrays)
 * that contain the current student's userID (i.e. quests that the student was a participant in). The Quest_Status
 * field of each document (if any documents exist) is then searched for a value of "submitted" (not "active,"
 * "approved" or "rejected" - the other possible values this field can take on). Any documents that make it through 
 * all of these filters will then increment a counter which acts as a flag for the student having a backlog of 
 * pending quests. This flag will then activate the "Pending Quests" button on this page.
 */
function checkPendingQuests() {
    let counter = 0;
    db.collection("Student_Quests")
        .where("Quest_Status", "==", "submitted")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Quest_Participant_IDs.includes(userID)) {
                    counter++;
                }
            })
            if (counter != 0) {
                enablePendingQuests();
            }
        })
        .catch((error) => {
            console.log("Error getting pending quests: ", error);
        });
}

/**
 * Changes the "Processed Quests" button from an inactive to an active state.
 */
function enableProcessedQuests() {
    $("#card-button-container-1 a").attr("href", "./student-processed-quests.html");
    $("#card-button-container-1").removeClass("inactive");
}

/**
 * Changes the "Pending Quests" button from an inactive to an active state.
 */
function enablePendingQuests() {
    $("#card-button-container-2 a").attr("href", "./student-pending-quests.html");
    $("#card-button-container-2").removeClass("inactive");
}

/**
 * Calls getCurrentUser() and starts the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentUser();

});
