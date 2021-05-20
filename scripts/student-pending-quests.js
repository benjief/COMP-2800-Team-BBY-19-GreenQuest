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
    db.collection("Students").doc(userID).collection("Quests")
        .where("Quest_Status", "==", "submitted")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let pendingQuest = {
                    "title": doc.data().Quest_Title, "description": doc.data().Quest_Description,
                    "date": doc.data().Date_Submitted, "bitmoji": doc.data().Quest_Bitmoji
                };
                pendingQuests.push(pendingQuest);
            });
            console.log(pendingQuests);
            if (pendingQuests.length == 0) {
                let message = "<p class='message'>You haven't got any pending tasks!</p>";
                $(".quest-list").append(message);
                $(".quest-list").css({
                    height: "100px",
                    display: "flex",
                    justifyContent: "center"
                });
            } else {
                getTimeElapsed();
            }
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
    let questDescription = "<p class='quest-description' id='quest-description-" + i + "'>" + pendingQuests[i].description + "</p>";
    $("#quest-container-" + i).append(questDescription);
    let elapsedTime = "<p class='quest-date' id='elapsed-time-" + i + "'>Submitted " + timeDifference + " "
        + unitOfTime + " ago</p>";
    $("#quest-container-" + i).append(elapsedTime);
    let questBitmoji = "<img src='" + pendingQuests[i].bitmoji + "'>";
    $("#quest-container-" + i).append(questBitmoji);
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();
});
