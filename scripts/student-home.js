// JS for student-home.html

var studentPoints;
var userID;
var questID;

// Pull 'firstvisit' tag from URL and use it to choose the correct message to display
const parsedUrl = new URL(window.location.href);
var firstVisit = parsedUrl.searchParams.get("firstvisit");

/**
 * Gets the current user's name and from Firestore and use it to create a personalized greeting.
 * Also assigns the user's ID to userID.
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
                    userID = doc.id;
                    checkIfInClass(doc);
                    getStudentPoints();
                    checkQuestHistory();
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
 * Write this.
 * 
 * @param {*} doc 
 */
 function checkIfInClass(doc) {
    if (doc.data().Student_Class != null) {
        enableMyQuest();
    }
}

/**
 * Write this.
 */
function checkQuestHistory() {
    let counter = 0;
    db.collection("Student_Quests")
        .where("Quest_Participant_IDs", "array-contains", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Quest_Status != "active") {
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
 * Write this.
 */
function onClickMyQuest() {
    db.collection("Students").doc(userID)
        .get()
        .then(function (doc) {
            // Extract the student's current quest, if it exists
            userID = doc.id;
            hasQuest = doc.data().Student_Quest;
            if (hasQuest) {
                getActiveQuest();
            } else {
                window.location.assign("/html/student-choose-quest.html");
            }
        });

}

function onClickMyProfile() {
    window.location.assign("./student-profile.html?userid=" + userID);
}

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
 * Write this.
 */
function getActiveQuest() {
    db.collection("Students").doc(userID)
        .get()
        .then(function (doc) {
            questID = doc.data().Student_Quest;
            window.location.assign("/html/student-view-quest.html?questid=" + questID);
        });
}

function postStudentPoints() {
    console.log(studentPoints);
    $("#student-points").html(studentPoints);
}

/** Write this. */
function enalbeQuestHistory() {
    $("#card-button-container-3 a").attr("href", "./student-quest-history.html");
    $("#card-button-container-3").removeAttr("inactive");
}

/** Write this. */
function enableMyQuest() {
    $("#card-button-container-2 a").attr("onclick", "onClickMyQuest()");
    $("#card-button-container-2").removeClass("inactive");
}

// Run function when document is ready 
$(document).ready(function () {
    sayHello();
});

//Load Timer
//Taken from https://www.w3schools.com/howto/howto_css_loader.asp
function delayTimer() {
    setTimeout(removeSpinner, 500);
  }
  
  function removeSpinner() {
    document.getElementById("loader").style.display = "none";
  }
  delayTimer();
