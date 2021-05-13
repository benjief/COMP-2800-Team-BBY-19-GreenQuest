// JS for student-my-class.js

var currentStudent;
var className;

// Create a variable to house the names of students who are also in this class
var studentsInClass = [];

/* Get the current user's name and class name from Firestore. */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current student's ID and class name
                    currentStudent = doc.data().Student_Name;
                    className = doc.data().Student_Class;
                    if (className == null) {
                        let message = "<p class='message'>You aren't in a class yet!</p>"
                        $(".student-list").append(message);
                    } else {
                        getStudentsInClass();
                    }
                });
        }
    });
}

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateStudentList() {
    if (studentsInClass.length == 0) {
        let message = "<p class='message'>There are no other students in your class!</p>"
        $(".student-list").append(message);
    } else {
        for (var i = 0; i < studentsInClass.length; i++) {
            let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
            $(".student-list").append(studentContainer);
            let studentName = "<p class='student-name' id='student-name-" + i + "'>" + studentsInClass[i] + "</p>";
            $("#student-container-" + i).append(studentName);
        }
    }
}

/** 
* Reads other students' names from Firestore and puts them into an array if they are in this student's class.
*/
function getStudentsInClass() {
    db.collection("Students")
        .where("Student_Class", "==", className)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Student_Name != currentStudent) {
                    studentsInClass.push(doc.data().Student_Name);
                }
            });
            populateStudentList();
        })
}

/**
 * Redirects users back to the student homepage.
 */
function onClickBack() {
    setTimeout(function () {
        location.href = "student-home.html";
    }, 1000);
}

/**
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();
});