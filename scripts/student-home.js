// JS for student-home.html

var studentPoints;
var userID;
var questID;
var userType;

// Pulls 'firstvisit' tag from URL and use it to choose the correct message to display.
const parsedUrl = new URL(window.location.href);
var firstVisit = parsedUrl.searchParams.get("firstvisit");

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 500 milliseconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
 function delayTimer() {
    setTimeout(removeSpinner, 500);
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
 * Pulls the current user's name from Firestore, before creating and displaying a personalized greeting.
 * Also checks to see if this is the user's first visit. If it is, a welcome message is displayed in a modal.
 * Furthermore, the user's ID is stored in userID.
*/
function sayHello() {
    if (firstVisit) {
        $("#welcomeMessage").modal("show");
    }
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students").doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    if (doc.data() == undefined) {
                        window.location.assign("../index.html");
                    }
                    userID = doc.id;
                    // Function cascade
                    checkIfInClass(doc);
                    getStudentPoints();
                    checkQuestHistory();
                    enableMyProfile();
                    enableLeaderboards();
                    // Extract the first name of the user
                    var name = doc.data().Student_Name.split(" ", 1);
                    if (name) {
                        if (firstVisit) {
                            $("#personalized-greeting").html("Welcome, " + name);
                        } else {
                            $("#personalized-greeting").html("Welcome back, " + name);
                        }
                        // Display a generic message if no name is entered when signing up
                    } else {
                        $("#personalized-greeting-new-user").html("Welcome, GreenQuest User!");
                        $("#personalized-greeting-established-user").html("Welcome back, GreenQuest User!");
                    }
                });
        }
    });
}

/**
 * Checks to see if the student is in a class. If they are, the "My Quest" button is enabled.
 * 
 * @param {*} doc - The current student's document in Firestore.
 */
function checkIfInClass(doc) {
    if (doc.data().Student_Class != null) {
        enableMyQuest();
    }
}

/**
 * Sweeps the "Student_Quests" collection in Firestore and searches for the current student's
 * user ID in each quest's list of Participant IDs. If at least one quest is found whose status 
 * isn't "active" (a quest that hasn't been submitted), the "Quest History" button is enabled.
 */
function checkQuestHistory() {
    let counter = 0;
    db.collection("Student_Quests")
        .where("Quest_Participant_IDs", "array-contains", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Quest_Status !== "active") {
                    counter++;
                }
            })
            if (counter != 0) {
                enableQuestHistory();
            }
        })
        .catch((error) => {
            console.log("Error getting quest history: ", error);
        });
}

/**
 * When "My Quest" is clicked on, checks to see if the current student has an active quest (the ID of which
 * is stored in the "Student_Quest" field of each student document; this field is null if the student doesn't 
 * have an active quest). If the student has an active quest, they are redirected to the "View Quest" page, where they
 * can review the quest. If they don't have an active quest, they are redirected to the "Choose Quest" page, where they 
 * can select one to complete.
 */ 
function onClickMyQuest() {
    db.collection("Students").doc(userID)
        .get()
        .then(function (doc) {
            // Extract the student's current quest, if it exists
            userID = doc.id;
            questID = doc.data().Student_Quest;
            if (questID) {
                window.location.assign("/html/student-view-quest.html?questid=" + questID);
            } else {
                window.location.assign("/html/student-choose-quest.html");
            }
        });

}

/**
 * Redirects the student to their profile page, with their user ID included as a URL query string.
 */
function onClickMyProfile() {
    window.location.assign("./student-profile.html?userid=" + userID);
}

/**
 * Pulls the students points from Firestore (points are stored in the "Student_Points" field of the
 * student doc). 
 * Number formatting code is by 
 * @author Tom Pawlak.
 * @see https://blog.abelotech.com/posts/number-currency-formatting-javascript/
 * 
 */
function getStudentPoints() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    studentPoints = doc.data().Student_Points;
                    // Taken from https://blog.abelotech.com/posts/number-currency-formatting-javascript/
                    studentPoints = studentPoints.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    postStudentPoints();
                });
        }
    });
}

/**
 * Adds student points to the DOM.
 */
function postStudentPoints() {
    console.log(studentPoints);
    $("#student-points").html(studentPoints);
}

/**
 * Changes the "Leaderboards" button from an inactive to an active state.
 */
function enableLeaderboards() {
    $("#card-button-container-5 a").attr("href", "./student-leaderboard.html");
    $("#card-button-container-5").removeClass("inactive");
}

/**
 * Changes the "My Profile" button from an inactive to an active state.
 */
function enableMyProfile() {
    $("#card-button-container-1 a").attr("onclick", "onClickMyProfile()");
    $("#card-button-container-1").removeClass("inactive");
}

/**
 * Changes the "Quest History" button from an inactive to an active state.
 */
function enableQuestHistory() {
    $("#card-button-container-3 a").attr("href", "./student-quest-history.html");
    $("#card-button-container-3").removeClass("inactive");
}

/**
 * Changes the "My Quest" button from an inactive to an active state.
 */
function enableMyQuest() {
    $("#card-button-container-2 a").attr("onclick", "onClickMyQuest()");
    $("#card-button-container-2").removeClass("inactive");
}

/**
 * Calls sayHello() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    sayHello();
});
