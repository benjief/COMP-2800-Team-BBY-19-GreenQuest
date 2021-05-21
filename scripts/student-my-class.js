// JS for student-my-class.js

var currentStudent;
var className;

// Create a variable to house the names of students who are also in this class
var studentsInClass = [];

/**
 * Get the current user's name and class name from Firestore.
 */
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
                        $(".student-list").css({
                            height: "100px",
                            display: "flex",
                            justifyContent: "center"
                        })
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
        let message = "<div class='text-container'><p class='message'>There are no other students in your class!</p></div>"
        $(".student-list").append(message);
        $(".student-list").css({
            height: "100px",
            display: "flex",
            justifyContent: "center"
        })
    } else {
        for (var i = 0; i < studentsInClass.length; i++) {
            let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
            $(".student-list").append(studentContainer);
            let studentName = "<p class='student-name' id='student-name-" + i + "'>" + studentsInClass[i].name + "</p>";
            $("#student-container-" + i).append(studentName);
            let studentPoints = "<p class='student-points' id='student-points-" + i + "'>" + studentsInClass[i].points + "</p>";
            $("#student-container-" + i).append(studentPoints);
            let leafIcon = "<img src='/img/leaf_icon.png'>"
            $("#student-container-" + i).append(leafIcon);
        }
    }
}

/** 
 * Reads other students' names and scores from Firestore and puts them into an array if they are in this student's class.
 */
function getStudentsInClass() {
    db.collection("Students")
        .where("Student_Class", "==", className)
        .orderBy("Student_Points", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Student_Name != currentStudent) {
                    let studentObject = {"name":doc.data().Student_Name, "points":doc.data().Student_Points.toString()};
                    studentsInClass.push(studentObject);
                }
            });
            populateStudentList();
            addHeading();
        })
}

/**
 * Write this.
 */
function addHeading() {
    $(".page-heading").html(className);
}

/**
 * Redirects users back to the student homepage.
 */
function onClickBack() {
    setTimeout(function () {
        location.href = "./student-home.html";
    }, 1000);
}

/**
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();
});
