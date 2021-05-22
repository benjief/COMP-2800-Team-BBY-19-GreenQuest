// JS for student-processed-quests.js

var approvedQuests = [];
var rejectedQuests = [];
var processedQuests = [];
var userID;

/* Get the current user's ID from Firestore. */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current user's ID
                    userID = doc.id;
                    pullApprovedQuests()
                });
        }
    });
}

/**
 * Write this.
 */
function pullApprovedQuests() {
    db.collection("Students").doc(userID).collection("Quests")
        .where("Quest_Status", "==", "approved")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let approvedQuest = {
                    "title": doc.data().Quest_Title,
                    "date": doc.data().Date_Processed,
                    "bitmoji": doc.data().Quest_Bitmoji,
                    "points": doc.data().Quest_Points,
                    "unread": doc.data().Unread,
                    "status": "approved"
                };
                approvedQuests.push(approvedQuest);
            });
            console.log(approvedQuests);
            pullRejectedQuests();
        });
}

/**
 * Write this.
 */
function pullRejectedQuests() {
    db.collection("Students").doc(userID).collection("Quests")
        .where("Quest_Status", "==", "rejected")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let rejectedQuest = {
                    "title": doc.data().Quest_Title,
                    "date": doc.data().Date_Processed,
                    "bitmoji": doc.data().Quest_Bitmoji,
                    "points": doc.data().Quest_Points,
                    "unread": doc.data().Unread,
                    "status": "rejected"
                };
                rejectedQuests.push(rejectedQuest);
            });
            console.log(rejectedQuests);
            mergeProcessedQuests();
        });
}

/**
 * Write this.
 */
function mergeProcessedQuests() {
    processedQuests = approvedQuests.concat(rejectedQuests);
    // Sorting code taken from https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    processedQuests.sort((a, b) => (a.date > b.date) ? -1 : 1);
    // Append a message to the DOM if there are no quests to display
    if (processedQuests.length == 0) {
        let message = "<p class='message'>You haven't got any processed tasks!</p>";
        $(".quest-list").append(message);
        $(".quest-list").css({
            height: "100px",
            display: "flex",
            justifyContent: "center"
        });
    } else {
        getTimeElapsed();
    }
}

/**
 * Write this - note that it was taken from your other project.
 * 
 * @param {*} store 
 */
function getTimeElapsed() {
    for (var i = 0; i < processedQuests.length; i++) {
        // Get timestamp for quest submission (convert to a date object)
        var timeProcessed = processedQuests[i].date.toDate();
        // Create a new date to compare timestamp to
        var currentTime = new Date();
        // Calculate time difference between latest update and current time in milliseconds
        var timeDifference = currentTime.getTime() - timeProcessed.getTime();
        // Sets the time difference to 0 if it's negative (which happens upon updating a store's headcount for some reason)
        if (timeDifference < 0) {
            timeDifference = 0;
        }
        // Define variables to convert from milliseconds to other units of time
        var oneSecond = 1000;
        var oneMinute = 60 * oneSecond;
        var oneHour = 60 * oneMinute;
        var oneDay = 24 * oneHour;
        var oneYear = 365.25 * oneDay;
        var unitOfTime;
        // Get the correct unit of time to post
        if (timeDifference < oneSecond) {
            unitOfTime = "milliseconds";
        } else if (oneSecond <= timeDifference && timeDifference < oneMinute) {
            unitOfTime = "seconds";
            timeDifference /= oneSecond;
        } else if (oneMinute <= timeDifference && timeDifference < oneHour) {
            unitOfTime = "minutes";
            timeDifference /= oneMinute;
        } else if (oneHour <= timeDifference && timeDifference < oneDay) {
            unitOfTime = "hours";
            timeDifference /= oneHour;
        } else if (oneDay <= timeDifference && timeDifference < oneYear) {
            unitOfTime = "days";
            timeDifference /= oneDay;
        } else {
            unitOfTime = "years";
            timeDifference /= oneYear;
        }
        populateDOM(i, Math.floor(timeDifference), unitOfTime);
    }
    setUnreadToFalse();
}

/**
 * Write this.
 */
function populateDOM(i, timeDifference, unitOfTime) {
    let questContainer = "<div class='quest-container' id='quest-container-" + i + "'></div>";
    $(".quest-list").append(questContainer);
    let questTitle = "<p class='quest-title' id='quest-title-" + i + "'>" + processedQuests[i].title + "</p>";
    $("#quest-container-" + i).append(questTitle);
    let questPoints = "<p class='quest-points' id='quest-points-" + i + "'>" + processedQuests[i].points + " points</p>";
    $("#quest-container-" + i).append(questPoints);
    if (processedQuests[i].status === "approved") {
        var elapsedTime = "<p class='quest-date' id='elapsed-time-" + i + "'><span class='approved'>Approved</span> " + timeDifference + " "
            + unitOfTime + " ago</p>";
        var notification = "<img class='notification' src='/img/approved_icon.png'>";
    } else {
        var elapsedTime = "<p class='quest-date' id='elapsed-time-" + i + "'><span class='rejected'>Rejected</span> " + timeDifference + " "
            + unitOfTime + " ago</p>";
        var notification = "<img class='notification' src='/img/rejected_icon.png'>";
    }
    if (processedQuests[i].unread) {
        console.log("quest-container-")
        $("#quest-container-" + i).css({
            background: "linear-gradient(rgba(242, 175, 255, 0.7), rgba(238, 238, 238, 0.7)), url('/img/background_pattern_8.png')"
        });
        console.log("wtf");
    }
    $("#quest-container-" + i).append(elapsedTime);
    if (processedQuests[i].unread) {
        $("#quest-container-" + i).append(notification);
    }
    let questBitmoji = "<img class='bitmoji' src='" + processedQuests[i].bitmoji + "'>";
    $("#quest-container-" + i).append(questBitmoji);
    getBitmojiBackground();
}

/**
 * Write this.
 */
function getBitmojiBackground() {
    for (var i = 0; i < processedQuests.length; i++) {
        let randomNum = Math.floor(Math.random() * 5 + 3);
        $("#bitmoji-" + i).css({
            background: "url('../img/background_pattern_" + randomNum + ".png')"
        });
    }
}

/**
 * Write this.
 */
function setUnreadToFalse() {
    db.collection("Students").doc(userID).collection("Quests")
        .where("Unread", "==", true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                doc.ref.update({
                    Unread: false
                });
            });
        });
}


// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();
});
