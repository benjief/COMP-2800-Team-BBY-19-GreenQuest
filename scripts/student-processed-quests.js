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
                    pullQuests()
                });
        }
    });
}

/**
 * Write this.
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
 * Write this.
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
 * Write this - note that it was taken from your other project.
 * 
 * @param {*} store 
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
        // var notification = "<img class='notification' src='/img/approved_icon.png'>";
    } else {
        var elapsedTime = "<p class='quest-date' id='elapsed-time-" + i + "'><span class='rejected'>Rejected</span> " + timeDifference + " "
            + unitOfTime + " ago</p>";
        // var notification = "<img class='notification' src='/img/rejected_icon.png'>";
    }
    // if (processedQuests[i].unread) {
    //     console.log("quest-container-")
    //     $("#quest-container-" + i).css({
    //         background: "linear-gradient(rgba(242, 175, 255, 0.7), rgba(238, 238, 238, 0.7)), url('/img/background_pattern_8.png')"
    //     });
    //     console.log("wtf");
    // }
    $("#quest-container-" + i).append(elapsedTime);
    // if (processedQuests[i].unread) {
    //     $("#quest-container-" + i).append(notification);
    // }
    let questBitmoji = "<img class='bitmoji' id='bitmoji-" + i + "' src='" + processedQuests[i].bitmoji + "'>";
    $("#quest-container-" + i).append(questBitmoji);
    getBitmojiBackground();

    //share button appears.
    //Inline share buttons sourced from https://platform.sharethis.com/inline-share-buttons.
    // $("#quest-container-" + i).append($(".sharethis-inline-share-buttons"));
    console.log("does this work?");
    let shareButton = '<!-- ShareThis BEGIN --><div class="sharethis-inline-share-buttons"></div><!-- ShareThis END -->';
    $("#quest-container-" + i).append(shareButton);
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

// Run function when document is ready 
$(document).ready(function () {
    getCurrentUser();
});


//Delaying the loading of the ShareThis header file.
//Sourced from StackOverflow
//source: https://stackoverflow.com/questions/9611714/delay-script-loading

setTimeout(function() {
    var headID = document.getElementsByTagName("head")[0];         
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=60ad9735a28015001222d395&product=inline-share-buttons';
    headID.appendChild(newScript);
}, 2000);

