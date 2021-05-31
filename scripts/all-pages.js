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

function checkTimeOfDay() {
    let timeOfDay = new Date();
    if ((21 <= timeOfDay.getHours() && (timeOfDay.getHours() <= 23))
        || (0 <= timeOfDay.getHours() && timeOfDay.getHours() <= 4)) {
        $(document.body).css({ backgroundImage: "url('/img/background_clouds_night.png')" });
        $(".page-heading").css({ color: "#fff345" });
        $(".student-points-container img").attr("src", "/img/leaf_icon_night.png");
        $(".student-points-container p").css({ color: "#fff345" });
    } else if ((19 <= timeOfDay.getHours() && (timeOfDay.getHours() < 21))
        || (4 < timeOfDay.getHours() && timeOfDay.getHours() <= 7)) {
        $(document.body).css({ backgroundImage: "url('/img/background_clouds_dusk_dawn.png')" });
        $(".page-heading").css({ color: "white" });
        $(".student-points-container img").attr("src", "/img/leaf_icon.png");
        $(".student-points-container p").css({ color: "#ff7b00" });
    }
}

/**
 * Prevents the page from jumping upwards when a user clicks on the buttons.
 */
$(".button").click(function (event) {
    if ($(event.target).attr("href") === "#") {
        console.log($(event.target).attr("href"));
        console.log($(event.target).html());
        event.preventDefault();
    }
})

/**
 * Calls checkLoggedIn() and checkTimeOfDay() when a page is ready.
 */
$(document).ready(function () {
    checkLoggedIn();
    checkTimeOfDay();
});
