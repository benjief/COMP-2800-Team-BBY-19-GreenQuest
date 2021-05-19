// JS for about-us.html

const numEggs = 4;
var eggPositions = [1, 1, 1, 1];


function randomizeBackground() {
    let numCards = 5;
    for (var i = 1; i <= numCards; i++) {
        let randomBackground = Math.floor(Math.random() * 4 + 3);
        $("#bio-pic-" + i).css({ background: "url('/img/background_pattern_" + randomBackground + ".png')" });
    }
}

/**
 * Write this.
 * 
 * @param {*} element 
 */
function easterEgg(element) {
    let imageName = $(element).attr("id");
    // Extract number from element ID
    imageName = parseInt(imageName.match((/\d+/)));
    let currentCount = eggPositions[imageName - 1];
    if (currentCount < numEggs) {
        currentCount++;
    } else {
        currentCount = 1;
    }
    eggPositions[imageName - 1] = currentCount;
    let bioPicNames = ["benjie_", "sam_", "giwoun_", "gyephel_"];
    imageName = bioPicNames[imageName - 1] + currentCount + ".png";
    $(element).attr("src", "/img/" + imageName);
}

/** 
 * Write this.
 */
function onClickHome() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    if (doc.data() != null) {
                        location.href = "./educator-home.html";
                    } else {
                        location.href = "./student-home.html";
                    }
                })
        } else {
            location.href = "../index.html";
        }
    })
}

// Run function when document is ready 
$(document).ready(function () {
    randomizeBackground();
});
