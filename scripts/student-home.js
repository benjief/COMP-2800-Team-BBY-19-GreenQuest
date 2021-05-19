// JS for student-home.html

var studentPoints;

function onClickMyQuest() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the student's current quest, if it exists
                    hasQuest = doc.data().Student_Quest;
                    if (hasQuest) {
                        window.location.assign("/html/student-view-quest.html");
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

function postStudentPoints() {
    console.log(studentPoints);
    $("#student-points").html(studentPoints);
}

// Run function when document is ready 
$(document).ready(function () {
    getStudentPoints();
});


