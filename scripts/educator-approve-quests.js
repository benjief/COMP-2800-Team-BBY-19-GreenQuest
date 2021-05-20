// JS for educator-manage-quests.js

// Create an empty list to house quest IDs
var questIDs = [];

var currentUser = null;

/**
 * Appends a list of quests to the DOM.
 */
function populateQuestList() {
    if (questIDs.length == 0) {
        let message = "<div class='text-container'><p class='message'>You haven't got any quests to approve.</p></div>"
        $(".quest-list").append(message);
        $(".quest-list").css({
            height: "150px",
            width: "90%",
            display: "flex",
            justifyContent: "center",
            justifySelf: "center"
        });
        let backButtonContainer = "<div class='card-button-container'></div>";
        $(".quest-list").append(backButtonContainer);
        let backButton = "<a class='button' id='back-button' href='#' onclick='onClickHome()'>Home</a>";
        $(".card-button-container").append(backButton);

    } else {
        for (var i = 0; i < questIDs.length; i++) {
            let questContainer = "<div class='quest-container' id='quest-container-" + i + "'></div>";
            $(".quest-list").append(questContainer);
            let questName = "<p class='quest-name' id='" + questIDs[i] + "' + ' onclick='onSelectQuest()'>Quest " + (i + 1) + "</p>";
            $("#quest-container-" + i).append(questName);
        }
    }
}

/**
 * Write this
 */
function onClickHome() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    if (!doc) {
                        location.href = "./student-home.html";
                    } else {
                        location.href = "./educator-home.html";
                    }
                });
        }
    });
}

/**
 * Write this
 */
function listQuests() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.id;
                    console.log(currentUser);
                    getQuests();
                });
        }
    });
}

/**
 * Reads quest IDs from Firestore and puts them into an array.
 */
function getQuests() {
    db.collection("Educators").doc(currentUser).collection("Quests")
        .orderBy("Date_Submitted", "asc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                questIDs.push(doc.id);
            });
            populateQuestList();
        })
        .catch((error) => {
            console.log("Error getting quests: ", error);
        });
}

/**
 * Redirects users to a page where they can approve or reject the selected quest.
 */
function onSelectQuest() {
    $(document).click(function (event) {
        let questName = $(event.target).html();
        let questID = $(event.target).attr("id");
        setTimeout(function () {
            location.href = "./educator-approve-quest.html?questname=" + questName + "&questid=" + questID;
        }, 500);
    });
}

/**
 * Redirects users back to the the main page page.
 */
function onClickBack() {
    setTimeout(function () {
        location.href = "./educator-home.html?";
    }, 1000);
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    listQuests();
});