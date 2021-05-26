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
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students").doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    userID = doc.id;
                    getStudentPoints();
                    checkIfInClass(doc);
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
 */
function checkQuestHistory() {
    db.collection("Student_Quests")
        .where("Quest_Status", "!=", "active")
        .get()
        .then((querySnapshot) => {
            let numQuests = querySnapshot.size;
            if (numQuests == 0) {
                disableQuestHistory();
            }
        })
        .catch((error) => {
            console.log("Error getting quest history: ", error);
        });
}

/**
 * Write this.
 * 
 * @param {*} doc 
 */
function checkIfInClass(doc) {
    if (doc.data().Student_Class == null) {
        disableMyClass();
        disableMyQuest();
    }
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
function disableMyClass() {
    $("#card-button-container-1").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-1").css({ transform: "none" });
    $("#card-button-container-1 a").removeAttr("href");
}

/** Write this. */
function disableQuestHistory() {
    $("#card-button-container-3").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-3").css({ transform: "none" });
    $("#card-button-container-3 a").removeAttr("href");
}

/** Write this. */
function disableMyQuest() {
    $("#card-button-container-2").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-2").css({ transform: "none" });
    $("#card-button-container-2 a").removeAttr("onclick");
}

// Run function when document is ready 
$(document).ready(function () {
    sayHello();
});