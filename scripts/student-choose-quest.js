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

/* Get the current user's name, class name, educator ID, and ID from Firestore. */
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
                        $("#main-content-card > .text-container").remove();
                        $("#main-content-card > .image-container").remove();
                        let message = "<div class='text-container' id='message-container'><p id='message'>" +
                            "You haven't been added to a class yet!</p></div>";
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
                    getQuestIDs();
                });
        }
    });
}

/**
 * Write this
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
 * Write this.
 */
function getQuest(id) {
    db.collection("Quests").doc(id)
        // Read
        .get()
        .then(function (doc) {
            currentQuestID = doc.id;
            questTitle = doc.data().title;
            questDescription = doc.data().description;
            questInstructions = doc.data().instruction;
            questInfo = doc.data().moreInfo;
            getBitmoji();
        });
}

/**
 * Write this.
 * 
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
                    // bitmojiURL = imageRef.getDownloadURL();
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
 * CITE and write this 
 * (https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript?page=1&tab=votes#tab-top)
 */
function pseudorandomID() {
    let generatedID = Math.random().toString(36).replace(/[^a-z\d]+/g, '').substr(0, 11);
    console.log(generatedID);
    return generatedID;
}

/** 
 * Write this.
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

/** 
 * Write this.
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
 * Write this.
 */
function onClickAccept() {
    writeActiveQuest();
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
    // Stops videos from playing once modals are closed */
    $('#videoViewer').on('hide.bs.modal', function () {
        $('.modal-body iframe').attr('src', '');
    });
});

//Loading timer
function myFunction() {
  setTimeout(showPage, 2000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
}
myFunction();