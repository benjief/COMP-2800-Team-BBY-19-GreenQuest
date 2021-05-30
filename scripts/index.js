// JS for index.html

// /**
//  * Pulls a bitmoji image from Cloud Storage and pushes it to our index page DOM.
//  */
// function getBitmoji() {
//     let storageRef = storage.ref();
//     folderRef = storageRef.child("/images/bitmojis");
//     storageRef.child("/images/bitmojis/36.png").getDownloadURL()
//         .then((url) => {
//             bitmojiURL = url;
//             $("#bitmoji").attr("src", bitmojiURL);
//         })
//         .catch((error) => {
//             console.error("Error getting url: ", error);
//         })
// }

// /**
//  * Calls getBitmoji() when the page is ready.
//  */
// $(document).ready(function () {
//     getBitmoji();
// });

/**
 * Checks the time and changes the background image depending of it's night or day.
 */
 function checkTimeOfDay() {
    let timeOfDay = new Date();
    if ((20 <= timeOfDay.getHours() && (timeOfDay.getHours() <= 23))
        || (0 <= timeOfDay.getHours() && timeOfDay.getHours() <= 6)) {
        $(document.body).css({ backgroundImage: "url('/img/background_stars.png')" });
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
