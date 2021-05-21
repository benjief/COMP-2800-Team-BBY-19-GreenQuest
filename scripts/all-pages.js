// JS for all pages

/**
 * Gets the current user's name and from Firestore and use it to create a personalized greeting.
 * Also assigns the user's ID to userID.
*/
function checkLoggedIn() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (!somebody) {
            db.collection("Students")
                location.href = "./login.html";
        }
    });
}

/**
 * Call functions when the page is ready .
 */
 $(document).ready(function () {
    checkLoggedIn();
});