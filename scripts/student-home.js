// JS for student-home.html

var studentPoints;
var userID;
var questID;

// Pull 'firstvisit' tag from URL and use it to choose the correct message to display
const parsedUrl = new URL(window.location.href);
var firstVisit = parsedUrl.searchParams.get("firstvisit");

/**
 * Gets the current user's name from Firestore and use it to create personalized greetings
   on student-(new-)home.html.
 */
function sayHello() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
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
sayHello();

function onClickMyQuest() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
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
    db.collection("Students").doc(userID).collection("Quests")
        .where("Quest_Status", "==", "active")
        .get()
        .then((querySnapshot) => {
            // There should only ever be one quest at a time that's active
            querySnapshot.forEach((doc) => {
                questID = doc.data().Quest_ID;
            })
            window.location.assign("/html/student-view-quest.html?questid=" + questID);
        })
        .catch((error) => {
            console.log("Error getting quest ID: ", error);
        });
}

function postStudentPoints() {
    console.log(studentPoints);
    $("#student-points").html(studentPoints);
}

// Run functions when document is ready 
$(document).ready(function () {
    sayHello();
    getStudentPoints();
});