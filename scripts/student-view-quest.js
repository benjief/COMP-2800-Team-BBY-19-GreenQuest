// JS for student-view-quest.js

// Pull quest ID from URL
const parsedUrl = new URL(window.location.href);
var questID = parsedUrl.searchParams.get("questid");

var questTitle;
var questDescription;
var questInstructions;
var questInfo;
var bitmojiURL;
var userName;
var className;
var educatorName;
var userID;
var questID;

/**
 * Write this.
 */
 function getQuestID() {
    console.log(userID);
    db.collection("Students").doc(userID).collection("Quests")
    .where("Quest_Status", "==", "active")
    .get()
    .then((querySnapshot) => {
        // There should only ever be one quest at a time
        querySnapshot.forEach((doc) => {
            questID = doc.data().Quest_ID;
        })
        console.log(questID);
        getQuest();
    })
    .catch((error) => {
        console.log("Error getting quest ID: ", error);
    });
}

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
                    userName = doc.data().Student_Name;
                    className = doc.data().Student_Class;
                    educatorName = doc.data().Student_Educator;
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
 * Write this.
 */
function onClickSubmit() {
    location.href = "./student-submit-quest.html?questid=" + questID + "&userid=" + userID;
}


function resetQuest() {
    if (confirm("Are you sure?")) {
        db.collection("Students").doc(userID).collection("Quests")
        .where("Quest_Status", "==", "active")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var currentQuestID = doc.id;
                db.collection("Students").doc(userID).collection("Quests").doc(currentQuestID).delete()
                    .then(() => {
                        console.log("Document successfully deleted!");
                        db.collection("Students").doc(userID).update({
                            Student_Quest: false
                        })
                        console.log("Student_Quest is now false!");
                        location.href = "./student-choose-quest.html";
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
            });
        })
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
