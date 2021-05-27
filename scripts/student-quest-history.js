// JS for student-quest-history.html

var userID;

/* Get the current user's ID from Firestore. */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
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

// /**
//  * Write this.
//  */
// function checkUnreadQuests() {
//     let counter = 0;
//     db.collection("Student_Quests")
//         .where("Quest_Participant_IDs", "array-contains", userID)
//         .get()
//         .then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 if (doc.data().Quest_Unread == true) {
//                     counter++;
//                 }
//             });
//             if (counter > 0) {
//                 addAlert();
//             }
//         });
// }

// /**
//  * Write this.
//  */
// function addAlert() {
//     // $("#processed-quests-button").html($("#processed-quests-button").html() + "<br /> &#128276;");
//     let notificationBell = "<img class='notification' src='/img/notification_icon.png'>";
//     $("#card-button-container-1").append(notificationBell);
// }

/**
 * Write this.
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
 * Write this.
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

/** Write this. */
function enableProcessedQuests() {
    $("#card-button-container-1 a").attr("href", "./student-processed-quests.html");
    $("#card-button-container-1").removeClass("inactive");
}

/** Write this. */
function enablePendingQuests() {
    $("#card-button-container-2 a").attr("href", "./student-pending-quests.html");
    $("#card-button-container-2").removeClass("inactive");
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();

});
