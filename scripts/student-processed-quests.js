// JS for student-processed-quests.js

var approvedQuests = [];
var rejectedQuests = [];
var processedQuests = [];
var userID;

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 1.5 seconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
function delayTimer() {
    setTimeout(removeSpinner, 1350);
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
 * Pulls the current user's ID from the "Students" collection in Firestore. 
 */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    // Extract the current user's ID
                    userID = doc.id;
                    pullQuests()
                });
        }
    });
}

/**
 * Searches the "Student_Quests" collection in Firestore for documents with Quest_Participant_IDs fields (arrays)
 * that contain the current student's userID (i.e. quests that the student was a participant in). Query results
 * (if they exist) are ordered by their submission date, with newer quests at the top of the pile. The Quest_Status
 * field of each document is then searched for a value of "approved" or "rejected" (not "active" or "submitted" - the
 * other possible values this field can take on). Finally, the quests that make it through all of these filters are 
 * converted to JSON objects with title, date, bitmoji, points, and status fields, and pushed to the processedQuests array.
 */
function pullQuests() {
    db.collection("Student_Quests")
        // This is going to be slow, but I don't know how to combine where clauses
        .where("Quest_Participant_IDs", "array-contains", userID)
        .orderBy("Date_Processed", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Quest_Status === "approved" || doc.data().Quest_Status === "rejected") {
                    let processedQuest = {
                        "title": doc.data().Quest_Title,
                        "date": doc.data().Date_Processed,
                        "bitmoji": doc.data().Quest_Bitmoji,
                        "points": doc.data().Quest_Points,
                        "status": doc.data().Quest_Status
                    };
                    processedQuests.push(processedQuest);
                }
            });
            checkProcessedQuests();
        });
}

/**
 * If no processed quests are returned in the query above, a message is displayed letting the user know
 * that they haven't got any processed quests to view.
 */
function checkProcessedQuests() {
    if (processedQuests.length == 0) {
        let message = "<div class='message-container' id='my-inline-button'><img src='/img/slow_down.png'>"
            + "<p class='message'>Slow down - you haven't got any processed quests!</p></div>";
        $(".quest-list").append(message);
        $(".quest-list").css({
            height: "100%",
            display: "flex",
            justifyContent: "center"
        });
    } else {
        getTimeElapsed();
    }
}

/**
 * Takes the date property of a quest object in processedQuests and and calculates how much time (in milliseconds, seconds, 
 * minutes, hours, days, or years) has passed since that time. This function looks incredibly long, but that's just because
 * there are so many darn conditionals to deal with.
 */
function getTimeElapsed() {
    console.log(processedQuests.length);
    console.log(processedQuests);
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
}

/**
 * Creates a "quest container" DOM element that houses the quest's bitmoji, its title and the time that has
 * passed since it was processed (i.e. how long ago it was approved or rejected). Quest containers are created 
 * for all quests in processedQuests, and the final result is a list of all the user's processed quests.
 * 
 * @param {*} i - The index of the quest in processedQuests, currently being dealt with.
 * @param {*} timeDifference - How many milliseconds, seconds, minutes, hours, days, or years 
 *                             (as an interger) have passed since this quest was approved or rejected (e.g. SIX hours ago).
 * @param {*} unitOfTime - The unit of time timeDifference is expressed in (e.g. six HOURS ago).
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
    } else {
        var elapsedTime = "<p class='quest-date' id='elapsed-time-" + i + "'><span class='rejected'>Rejected</span> " + timeDifference + " "
            + unitOfTime + " ago</p>";
    }
    $("#quest-container-" + i).append(elapsedTime);
    let questBitmoji = "<img class='bitmoji' id='bitmoji-" + i + "' src='" + processedQuests[i].bitmoji + "'>";
    $("#quest-container-" + i).append(questBitmoji);
    getBitmojiBackground();
}

/**
 * Chooses a random background from five images. The "+ 3" appears here because of the way background
 * images were named/stored. Once a number is chosen, a background is assigned to the quest's bitmoji.
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
 * Calls getCurrentUser() and starts the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentUser();
});
