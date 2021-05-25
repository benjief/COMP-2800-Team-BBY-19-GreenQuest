// JS for student-pending-quests.js

var pendingQuests = [];
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
                    pullPendingQuests()
                });
        }
    });
}

/**
 * Write this.
 */
function pullPendingQuests() {
    db.collection("Student_Quests")
        // This is going to be slow, but I don't know how to combine where clauses
        .where("Quest_Status", "==", "submitted")
        .orderBy("Date_Submitted", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Quest_Participant_IDs.includes(userID)) {
                    let pendingQuest = {
                        "title": doc.data().Quest_Title,
                        "date": doc.data().Date_Submitted,
                        "bitmoji": doc.data().Quest_Bitmoji
                    };
                    pendingQuests.push(pendingQuest);
                }
            });
            console.log(pendingQuests);
            if (pendingQuests.length == 0) {
                appendMessage();
            } else {
                getTimeElapsed();
            }
        });
}

/**
 * Write this.
 */
function appendMessage() {
    let message = "<div class='message-container'><img src='/img/slow_down.png'>"
        + "<p class='message'>Slow down - you haven't got any pending quests!</p></div>";
    $(".quest-list").append(message);
    $(".quest-list").css({
        height: "300px",
        display: "flex",
        justifyContent: "center"
    });
}


/**
 * Write this - note that it was taken from your other project.
 * 
 * @param {*} store 
 */
function getTimeElapsed() {
    for (var i = 0; i < pendingQuests.length; i++) {
        // Get timestamp for quest submission (convert to a date object)
        var timeSubmitted = pendingQuests[i].date.toDate();
        // Create a new date to compare timestamp to
        var currentTime = new Date();
        // Calculate time difference between latest update and current time in milliseconds
        var timeDifference = currentTime.getTime() - timeSubmitted.getTime();
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
}

/**
 * Write this.
 */
function populateDOM(i, timeDifference, unitOfTime) {
    let questContainer = "<div class='quest-container' id='quest-container-" + i + "'></div>";
    $(".quest-list").append(questContainer);
    let questTitle = "<p class='quest-title' id='quest-title-" + i + "'>" + pendingQuests[i].title + "</p>";
    $("#quest-container-" + i).append(questTitle);
    let elapsedTime = "<p class='quest-date' id='elapsed-time-" + i + "'>Submitted " + timeDifference + " "
        + unitOfTime + " ago</p>";
    $("#quest-container-" + i).append(elapsedTime);
    let questBitmoji = "<img id='bitmoji-" + i + "'src='" + pendingQuests[i].bitmoji + "'>";
    $("#quest-container-" + i).append(questBitmoji);
    getBitmojiBackground();
}

/**
 * Write this.
 */
function getBitmojiBackground() {
    for (var i = 0; i < pendingQuests.length; i++) {
        let randomNum = Math.floor(Math.random() * 5 + 3);
        $("#bitmoji-" + i).css({
            background: "url('../img/background_pattern_" + randomNum + ".png')"
        });
    }
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();
});
