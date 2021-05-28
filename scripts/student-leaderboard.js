// JS for student-leaderboard.js

var userID;

/**
 * Pulls the current student's ID and from the "Students" collection in Firestore.
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
 * Checks Firestore to see if the current student is in a class. If they are, the "My Class" button is enabled.
 * 
 * @param {*} doc - The current student's Firestore doc.
 */
function checkIfInClass(doc) {
    if (doc.data().Student_Class != null) {
        enableMyClass();
    }
}

/**
 * Changes the "My Class" button from an inactive to an active state.
 */
function enableMyClass() {
        $("#card-button-container-1 a").attr("href", "./student-my-class.html");
        $("#card-button-container-1").removeClass("inactive");
}

/**
 * Runs getCurrentStudent() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();
});
