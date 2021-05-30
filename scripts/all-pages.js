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
 * Checks the time and changes the background image depending of it's night or day.
 */
function checkTimeOfDay() {
    let timeOfDay = new Date();
    if ((20 <= timeOfDay.getHours() && (timeOfDay.getHours() <= 23))
        || (0 <= timeOfDay.getHours() && timeOfDay.getHours() <= 6)) {
        $(document.body).css({ backgroundImage: "url('/img/background_stars.png')" });
        $(".page-heading").css({ color: "white" });
    }
}

/**
 * Calls checkLoggedIn() when a page is ready.
 */
$(document).ready(function () {
    checkLoggedIn();
    checkTimeOfDay();
});
