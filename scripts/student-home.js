// JS for student-home.html

var studentPoints;
var userID;
var questID;

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

// Run function when document is ready 
$(document).ready(function () {
    getStudentPoints();
});