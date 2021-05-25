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

/**
 * Write this.
 */
function checkUnreadQuests() {
    let counter = 0;
    db.collection("Student_Quests")
        .where("Quest_Participant_IDs", "array-contains", userID)
        .get()
        .then((querySnapshot) => {
            if (doc.data().Unread == true) {
                querySnapshot.forEach((doc) => {
                    counter++;
                });
                if (counter > 0) {
                    addAlert();
                }
            }
        });
}

/**
 * Write this.
 */
function addAlert() {
    // $("#processed-quests-button").html($("#processed-quests-button").html() + "<br /> &#128276;");
    let notificationBell = "<img class='notification' src='/img/notification_icon.png'>";
    $("#card-button-container-1").append(notificationBell);
}

/**
 * Write this.
 */
function checkProcessedQuests() {
    db.collection("Student_Quests")
        // The Quest_Points attribute is unique to processed quests
        .where("Quest_Points", "!=", null)
        .get()
        .then((querySnapshot) => {
            let numQuests = querySnapshot.size;
            if (numQuests == 0) {
                disableProcessedQuests();
            } else {
                checkUnreadQuests();
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
                if (doc.data().Quest_Submitter_IDs.includes(userID)) {
                    counter++;
                }
            })
            if (counter == 0) {
                disablePendingQuests();
            }
        })
        .catch((error) => {
            console.log("Error getting pending quests: ", error);
        });
}

/** Write this. */
function disableProcessedQuests() {
    $("#card-button-container-1").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-1").css({ transform: "none" });
    $("#card-button-container-1 a").removeAttr("href");
}

/** Write this. */
function disablePendingQuests() {
    $("#card-button-container-2").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-2").css({ transform: "none" });
    $("#card-button-container-2 a").removeAttr("href");
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();

});
