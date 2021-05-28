// JS for all pages

/**
 * Checks to see if a user is logged in. If they aren't, they are redirected to the login page.
*/
function checkLoggedIn() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (!somebody) {
            location.href = "./login.html";
        }
    });
}

/**
 * Call checkLoggedIn() when a page is ready.
 */
$(document).ready(function () {
    checkLoggedIn();
});