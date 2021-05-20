// JS for student-view-quest.html

// Pull quest ID from URL
const parsedUrl = new URL(window.location.href);
var questID = parsedUrl.searchParams.get("questid");
var uniqueID = parsedUrl.searchParams.get("uniqueid");
console.log(uniqueID);

var questTitle;
var questDescription;
var questInstructions;
var questInfo;
var bitmojiURL;
var userID;

/* Get the current user's name, class name, educator name, and ID from Firestore. */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current student's class name
                    userID = doc.id;
                    getQuest();
                });
        }
    });
}

/**
 * Write this.
 */
function getQuest() {
    console.log(questID);
    db.collection("Quests").doc(questID)
        // Read
        .get()
        .then(function (doc) {
            questTitle = doc.data().title;
            questDescription = doc.data().description;
            questInstructions = doc.data().instruction;
            questInfo = doc.data().moreInfo;
            getBitmoji();
        });
}

/**
 * Write this.
 */
function getBitmoji() {
    db.collection("Students").doc(userID).collection("Quests").doc(uniqueID)
    .get()
    .then(function (doc) {
        bitmojiURL = doc.data().Quest_Bitmoji;
        addInfoToDOM();
    });
}

/**
 * Write this.
 */
function addInfoToDOM() {
    let title = "<p id='quest-title'>" + questTitle + "</p>";
    $("#quest-title-container").append(title);
    let description = "<p id='quest-description'>Your Quest:<br />" + questDescription + "</p>";
    $("#quest-description-container").append(description);
    let bitmoji = "<img src='" + bitmojiURL + "'>";
    $(".image-container").append(bitmoji);
    getBitmojiBackground();
    let instructions = "<a id='quest-instructions' onclick='showVideo(this)'" +
        "data-bs-toggle='modal' data-bs-target='#videoViewer'>Instructions</a>";
    $("#quest-instructions-container").append(instructions);
    let info = "<a id='quest-information' onclick='showVideo(this)'" +
        "data-bs-toggle='modal' data-bs-target='#videoViewer'>More Information</a>";
    $("#quest-information-container").append(info);
}

/**
 * Write this.
 * 
 * @param {*} element 
 */
function showVideo(element) {
    let category = $(element).attr("id");
    let videoURL = null;
    let videoTitle = null;

    if (category === "quest-instructions") {
        videoURL = questInstructions;
        videoTitle = "Instructions";

    } else {
        videoURL = questInfo;
        videoTitle = "More Information";
    }

    $(".modal-body").html("");

    if (videoURL) {
        $(".modal-title").html(videoTitle);
        $(".modal-body").html("<iframe src='" + videoURL + "' allowfullscreen>");
    } else {
        $(".modal-title").html("No video available");
        $(".modal-body").html("Sorry, we couldn't generate a video for you.");
    }
}

/**
 * Write this.
 */
function getBitmojiBackground() {
    let randomNum = Math.floor(Math.random() * 5 + 3);
    $(".image-container").css({
        background: "url('../img/background_pattern_" + randomNum + ".png')"
    });
}

/**
 * Write this.
 */
function onClickSubmit() {
    location.href = "./student-submit-quest.html?questid=" + questID + "&userid=" + userID;
}

/**
 * Write this.
 */
function updateStudent() {
    db.collection("Students").doc(userID).update({
            Student_Quest: false
        })
        .then(() => {
            console.log("Student_Quest successfully deactivated!");
            deleteQuest()
        }).catch((error) => {
            console.error("Error deactivating student quest: ", error);
        });
}

/** 
 * Write this.
 */
function deleteQuest() {
    db.collection("Students").doc(userID).collection("Quests").doc(uniqueID)
        .delete()
        .then(() => {
            console.log("Quest successfully deleted!");
            location.href = "./student-choose-quest.html";
        }).catch((error) => {
            console.error("Error deleting quest: ", error);
        });
}

/**
 * Write this.
 */
function resetQuest() {
    if (confirm("Are you sure?")) {
        updateStudent();
    } else {
        console.log("Reset quest cancelled");
    }
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
    // Stops videos from playing once modals are closed */
    $('#videoViewer').on('hide.bs.modal', function () {
        $('.modal-body iframe').attr('src', '');
    });
});