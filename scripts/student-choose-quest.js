// JS for student-choose-quest.html

var questIDs = [];
var currentQuestID;
var questTitle;
var questDescription;
var questInstructions;
var questInfo;
var bitmojiURL;
var userName;
var className;
var educatorID;
var userID;

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 1.5 seconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
function delayTimer() {
    setTimeout(removeSpinner, 2000);
}

/**
 * Sets the spinner's display to none.
 */
function removeSpinner() {
    document.getElementById("loader").style.display = "none";
}
// Run the delay timer 
delayTimer();

/* Pulls the current student's name, class name, educator ID, and ID from the "Students" collection in Firestore. 
   Displays a message if the student isn't in a class. */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current student's class name
                    userName = doc.data().Student_Name;
                    className = doc.data().Student_Class;
                    educatorID = doc.data().Student_Educator;
                    userID = doc.id;
                    if (className == null) {
                        // Display a message on the page if the student isn't in a class
                        displayMessage();
                    }
                    getQuestIDs();
                });
        }
    });
}

/**
 * If the student viewing this page isn't in a class, they can't choose a quest to participate in (themselves).
 * As such, a message is displayed on the page prompting the student to ask their teacher about being added to 
 * a class.
 */
function displayMessage() {
    $("#main-content-card > .text-container").remove();
    $("#main-content-card > .image-container").remove();
    let message = "<div class='text-container' id='message-container'><p id='message'>" +
        "Ask your teacher to add you to their class to choose your own quests!</p></div>";
    $("#main-content-card").append(message);
    $(".page-heading").html("No Class!");
    $("#message-container").css({
        width: "90%",
        fontWeight: "600",
        justifySelf: "center"
    });
    $("#card-button-container-2").remove();
    $("#accept-button").removeAttr("onclick");
    $("#accept-button").attr("href", "./student-home.html");
    $("#accept-button").html("Home");
    $(".card-button-container").css({
        marginBottom: "30px"
    });
}

/**
 * Pulls all quest IDs from the "Quests" collection in Firestore and pushes them to an array. Then, generates 
 * a random number between 0 and the number of quests (minus 1, since array indices start at 0) which is 
 * used to select a quest to display (using that quest's ID).
 */
function getQuestIDs() {
    db.collection("Quests")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                questIDs.push(doc.id);
            })
            let numOfQuests = questIDs.length;
            let randomNum = Math.floor(Math.random() * numOfQuests);
            currentQuestID = questIDs[randomNum];
            getQuest(currentQuestID);
        })
        .catch((error) => {
            console.log("Error getting quest ID: ", error);
        });
}

/**
 * Using the quest ID selected above, pulls all of the data corresponding to that quest from the "Quests"
 * collection in Firestore. This data includes: the quest title, description, instructions, and info.
 * 
 * @param {*} id 
 */
function getQuest(id) {
    db.collection("Quests").doc(id)
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
 * Lists all of the bitmoji images we have in Cloud Storage, and then generates a random number to choose
 * one that will be displayed with the current quest.
 */
function getBitmoji() {
    let counter = 0;
    let storageRef = storage.ref();
    folderRef = storageRef.child("images/bitmojis");
    folderRef.listAll()
        // Workaround for getting the number of images in the folder
        .then((res) => {
            res.items.forEach(() => {
                counter++;
            });
            let randomNum = Math.floor(Math.random() * counter + 1);
            storageRef.child("images/bitmojis/" + randomNum.toString() + ".png").getDownloadURL()
                .then((url) => {
                    bitmojiURL = url;
                    addInfoToDOM();
                })
                .catch((error) => {
                    console.error("Error getting url: ", error);
                })
        })
        .catch((error) => {
            console.error("Error getting number of bitmojis: ", error);
        });
}

/**
 * Once all of the data required to properly display a quest is fetched, it is turned into DOM elements
 * and displayed on the page.
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
 * Chooses a random background from five images. The "+ 3" appears here because of the way background
 * images were named/stored. Once a number is chosen, a background is assigned to the bitmoji container.
 */
function getBitmojiBackground() {
    let randomNum = Math.floor(Math.random() * 5 + 3);
    $(".image-container").css({
        background: "url('../img/background_pattern_" + randomNum + ".png')"
    });
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
 * When the user clicks the "Accept" button, writeActiveQuest() is called.
 */
function onClickAccept() {
    writeActiveQuest();
}

/** 
 * Creates a quest document in the Firestore "Student_Quests" collection using a pseudorandom ID generated 
 * by pseudorandomID(). Fields set are: Quest_Status, Quest_Bitmoji (the image currently displayed on the page is
 * permanently assigned to the quest), Quest_Title, Quest_Description, Quest_Instructions, Quest_Info, Quest_Participants
 * (initially an array containing only the current student), Quest_Participant_IDs (initially an array containing only the
 * current student's ID), and Quest_Approver_ID (the ID of the student's teacher, or the "owner" of the class they've been 
 * added to).
 */
function writeActiveQuest() {
    let questID = pseudorandomID();
    // Update student quest
    db.collection("Student_Quests").doc(questID).set({
        Quest_Status: "active",
        Quest_Bitmoji: bitmojiURL,
        Quest_Title: questTitle,
        Quest_Description: questDescription,
        Quest_Instructions: questInstructions,
        Quest_Info: questInfo,
        Quest_Participants: [userName],
        Quest_Participant_IDs: [userID],
        Quest_Approver_ID: educatorID,
    })
        .then(() => {
            console.log("Quest successfully written!");
            updateStudentQuestStatus(questID);
        })
        .catch((error) => {
            console.error("Error writing quest: ", error);
        });
}

/**
 * Generates an 11-digit pseudorandom ID to be used as a quest ID.
 * This code was modified from a StackOverflow comment by @author Friedrich
 * @see https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript?page=1&tab=votes#tab-top
 */
function pseudorandomID() {
    let generatedID = Math.random().toString(36).replace(/[^a-z\d]+/g, '').substr(0, 11);
    console.log(generatedID);
    return generatedID;
}

/** 
 * Updates the current student's Student_Quest attribute in Firestore with the pseudorandom quest ID
 * given to the quest written above.
 */
function updateStudentQuestStatus(questID) {
    db.collection("Students").doc(userID).update({
        Student_Quest: questID
    })
        .then(() => {
            console.log("Quest successfully activated!");
            location.href = "./student-view-quest.html?questid=" + questID;
        })
        .catch((error) => {
            console.error("Error activating quest: ", error);
        });
}

// Calls getCurrentStudent() and initiates the function cascade when the document is ready.
$(document).ready(function () {
    getCurrentStudent();

    /**
    * Stops videos from playing once modals are closed.
    */
    $('#videoViewer').on('hide.bs.modal', function () {
        $('.modal-body iframe').attr('src', '');
    });
});
