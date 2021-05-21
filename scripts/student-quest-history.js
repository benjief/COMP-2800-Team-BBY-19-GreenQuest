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
                    checkUnreadQuests();
                });
        }
    });
}

/**
 * Write this.
 */
 function checkUnreadQuests() {
    let counter = 0;
    db.collection("Students").doc(userID).collection("Quests")
        .where("Unread", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                counter++;
                console.log(doc.data());
            });
            console.log(counter);
            if (counter > 0) {
                addAlert();
            }
        });
}

/**
 * Write this.
 */
function addAlert() {
    $("#processed-quests-button").html($("#processed-quests-button").html() + "<br /> &#128276;");
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();
});
