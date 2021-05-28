// JS for about-us.html

// Pull user type from URL (used below to send users back to the correct homepage location)
const parsedUrl = new URL(window.location.href);
var userType = parsedUrl.searchParams.get("usertype");

// Easter egg variables
const numEggs = 4;
var eggPositions = [1, 1, 1, 1]; // Stores the positions of each of four profile images (can range from 1 to 4)

/**
 * Chooses a random background from four images. The "+ 3" appears here because of the way background
 * images were named/stored. Once a number is chosen, a background is assigned to one of 
 */
function randomizeBackground() {
    let numCards = 4;
    // Bio pics are numbered from 1 to 4
    for (var i = 1; i <= numCards; i++) {
        let randomBackground = Math.floor(Math.random() * 4 + 3);
        $("#bio-pic-" + i).css({
            background: "url('/img/background_pattern_" + randomBackground + ".png')"
        });
    }
}

/**
 * Allows users to click on each bio pic and loop through a series of egg-related images (our Easter egg).
 * Images are numbered from 1 to 4, so there are four "positions" to cycle through (including the first) before looping back to 
 * the start.
 * 
 * @param {*} element - The profile picture (image) in the DOM that is being clicked on.
 */
function easterEgg(element) {
    let imageName = $(element).attr("id");
    // Extract number from element ID (falls in the range [1, 4])
    imageName = parseInt(imageName.match((/\d+/)));
    // Indices in the eggPositions array start at 0
    let currentCount = eggPositions[imageName - 1];
    // numEggs = 4 (the number of images to cycle through)
    if (currentCount < numEggs) {
        currentCount++;
    } else {
        // Reset the cycle
        currentCount = 1;
    }
    // Increment (or reset) this image's position in the eggPositions array
    eggPositions[imageName - 1] = currentCount;
    // Has to do with image storage names
    let bioPicNames = ["benjie_", "sam_", "giwoun_", "gyephel_"];
    imageName = bioPicNames[imageName - 1] + currentCount + ".png";
    // Update the image displayed in the DOM
    $(element).attr("src", "/img/" + imageName);
}

/** 
 * Makes use of userType (pulled from a parsed URL query string) to redirect users to the 
 * appropriate page when they click on the "Home" button. Since all users (educators, students and
 * unregistered visitors) can access this page, we didn't want anyone ending up in the wrong place, and 
 * this was one strategy for dealing with this issue.
 */
function onClickHome() {
    if (userType === "educator") {
        location.href = "./educator-home.html";
    } else if (userType === "student") {
        location.href = "./student-home.html";
    } else {
        location.href = "../index.html";
    }
}

/**
 * Calls randomizeBackground() when the page is ready.
 */
$(document).ready(function () {
    randomizeBackground();
});