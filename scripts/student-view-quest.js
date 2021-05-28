// JS for student-view-quest.html

// Pull quest ID from URL (passed from student-home.html)
const parsedUrl = new URL(window.location.href);
var questID = parsedUrl.searchParams.get("questid");

var questTitle;
var questDescription;
var questInstructions;
var questInfo;
var bitmojiURL;
var userID;

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 1.5 seconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
function delayTimer() {
    setTimeout(removeSpinner, 1500);
}

/**
 * Sets the spinner's display to none.
 */
function removeSpinner() {
    document.getElementById("loader").style.display = "none";
}
// Run the delay timer 
delayTimer();

/**
 * Gets the current user's ID from Firestore.
 */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students").doc(somebody.uid)
                .get()
                .then(function (doc) {
                    // Extract the current student's user ID
                    userID = doc.id;
                    getQuestInfo();
                });
        }
    });
}

/**
 * Pulls all of this quest's information from Firestore: its title title and description, along with instruction and
 * more info video links.
 */
function getQuestInfo() {
    db.collection("Student_Quests").doc(questID)
        // Read
        .get()
        .then(function (doc) {
            questTitle = doc.data().Quest_Title;
            questDescription = doc.data().Quest_Description;
            questInstructions = doc.data().Quest_Instructions;
            questInfo = doc.data().Quest_Info;
            // The above code running ensures that the student does indeed have an active quest, so the "Submit Quest" button can be activated
            enableSubmitQuest();
            getBitmoji();
        })
        .catch((error) => {
            console.log("Error getting quest: ", error);
        });
}

/**
 * Pulls the bitmoji image assigned to this quest when it was chosen 
 */
function getBitmoji() {
    db.collection("Student_Quests").doc(questID)
        .get()
        .then(function (doc) {
            // Pull image link from Firestore
            bitmojiURL = doc.data().Quest_Bitmoji;
            addInfoToDOM();
        })
        .catch((error) => {
            console.log("Error getting bitmoji: ", error);
        });
}

/**
 * Adds all of the quest information pulled from Firestore above to the DOM.
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
 * Opens up a Bootstrap modal to display a video. This is triggered when either
 * of the "Instructions" or "More Info" anchors are clicked on.
 * 
 * @param {*} element  - The DOM element being displayed in this modal.
 */
function showVideo(element) {
    let category = $(element).attr("id");
    let videoURL = null;
    let videoTitle = null;

    // Assign variables that will be used to populate the modal with instructions-specific content
    if (category === "quest-instructions") {
        videoURL = questInstructions;
        videoTitle = "Instructions";
        // Assign variables that will be used to populate the modal with info-specific content
    } else {
        videoURL = questInfo;
        videoTitle = "More Information";
    }
    // Clear any content that may still be populating the modal
    $(".modal-body").html("");
    if (videoURL) {
        $(".modal-title").html(videoTitle);
        $(".modal-body").html("<iframe src='" + videoURL + "' allowfullscreen>");
    } else {
        $(".modal-title").html("No video available");
        $(".modal-body").html("Sorry, we couldn't load this video for you.");
    }
}

/**
 * Selects a random background for the quest's bitmoji from a collection of 5 background images (stored locally).
 */
function getBitmojiBackground() {
    // The "+ 3" corresponds purely to how background images are named
    let randomNum = Math.floor(Math.random() * 5 + 3);
    $(".image-container").css({
        background: "url('../img/background_pattern_" + randomNum + ".png')"
    });
}

/**
 * Redirects the student to the "Submit Quest" page, passing along the IDs of both the student and the quest to be submitted
 * (currently being viewed).
 */
function onClickSubmit() {
    location.href = "./student-submit-quest.html?questid=" + questID + "&userid=" + userID;
}

/**
 * Updates the quest-submitting student's "Student_Quest" field in Firestore to null. This field is used as a flag
 * for whether or not a student is eligible to select a new quest.
 */
function updateStudent() {
    db.collection("Students").doc(userID).update({
        Student_Quest: null
    })
        .then(() => {
            console.log("Student_Quest successfully deactivated!");
            deleteQuest()
        }).catch((error) => {
            console.error("Error deactivating student quest: ", error);
        });
}


/**
 * Asks the student if they're sure they want to choose a new quest and discard the one they're currently viewing.
 * If they choose "Ok," their status is reset, and their current quest is deleted. If they choose "Cancel," nothing happens.
 */
function resetQuest() {
    if (confirm("Are you sure?")) {
        updateStudent();
    } else {
        console.log("Reset quest cancelled.");
    }
}

/** 
 * Deletes the quest being viewed from the database if a user decides to choose a new one.
 */
function deleteQuest() {
    db.collection("Student_Quests").doc(questID)
        .delete()
        .then(() => {
            console.log("Quest successfully deleted!");
            location.href = "./student-choose-quest.html";
        }).catch((error) => {
            console.error("Error deleting quest: ", error);
        });
}

/**
 * Changes the "Submit Quest" button from an inactive to an active state.
 */
function enableSubmitQuest() {
    $("#card-button-container-1 a").attr("onclick", "onClickSubmit()");
    $("#card-button-container-1").removeClass("inactive");
}

/**
 * Calls getCurrentStudent() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();

    /**
     * Stops videos from playing once modals are closed.
     */
    $('#videoViewer').on('hide.bs.modal', function () {
        $('.modal-body iframe').attr('src', '');
    });
});
