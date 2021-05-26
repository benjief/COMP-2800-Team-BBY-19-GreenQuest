// JS for student-leaderboard.js

var userID;

/**
 * Gets the current student's ID and from Firestore.
*/
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students").doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    userID = doc.id;
                    checkIfInClass(doc);
                });
        }
    });
}

/**
 * Write this.
 * 
 * @param {*} doc 
 */
function checkIfInClass(doc) {
    if (doc.data().Student_Class == null) {
        disableMyClass();
    }
}

/** Write this. */
function disableMyClass() {
    $("#card-button-container-1").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-1").css({ transform: "none" });
    $("#card-button-container-1 a").removeAttr("href");
}


// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
});