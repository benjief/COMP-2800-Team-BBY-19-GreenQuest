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
                    // Extract the current student's name and class name
                    currentStudent = doc.data().Student_Name;
                    className = doc.data().Student_Class;
                    if (className == null) {
                        let message = "<div class='message-container'><img src='/img/slow_down.png'>"
                            + "<p class='message'>Slow down - ask your teacher to add you to their class!</p></div>";
                        $(".student-list").append(message);
                        $(".student-list").css({
                            height: "300px",
                            display: "flex",
                            justifyContent: "center"
                        })
                        $("#before-class-total").css({ marginBottom: "15px" });
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
function populateStudentList(currentStudent) {
    var classTotalPoints = 0;
    for (var i = 0; i < studentsInClass.length; i++) {
        let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
        $(".student-list").append(studentContainer);
        let studentName = "<p class='student-name' id='student-name-" + i + "'>" + studentsInClass[i].name + "</p>";
        $("#student-container-" + i).append(studentName);
        // Different container color for current student
        if (studentsInClass[i].name === currentStudent) {
            $("#student-container-" + i).addClass("current-student-container");
        }
        let studentPoints = "<p class='student-points' id='student-points-" + i + "'>" + studentsInClass[i].points + "</p>";
        $("#student-container-" + i).append(studentPoints);
        let leafIcon = "<img src='/img/leaf_icon.png'>"
        $("#student-container-" + i).append(leafIcon);
        classTotalPoints += parseInt(studentsInClass[i].points);
    }
    populateClassTotalScore(classTotalPoints);
}

/**
 * Prints the total point for the class
 * 
 * @param {*} classTotalPoints 
 */
function populateClassTotalScore(classTotalPoints) {
    $("#before-class-total").after(
        "<div class='student-container' id='class-total-container'>");
    $("#class-total-container").append("<p class='student-name'>Class Total:</p>");
    let totalPoints = "<p class='student-points'>" + classTotalPoints + "</p>";
    $("#class-total-container").append(totalPoints);
    let leafIcon = "<img src='/img/leaf_icon.png'>";
    $("#class-total-container").append(leafIcon);
}

/** 
 * Reads the students' names and scores from Firestore and puts them into an array if they are in this student's class.
 */
function getStudentsInClass() {
    db.collection("Students")
        .where("Student_Class", "==", className)
        .orderBy("Student_Points", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let studentObject = { "name": doc.data().Student_Name, "points": doc.data().Student_Points.toString() };
                studentsInClass.push(studentObject);
            });
            populateStudentList(currentStudent);
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
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();
});

//Load Timer
function myFunction() {
    setTimeout(showPage, 1300);
  }
  
  function showPage() {
    document.getElementById("loader").style.display = "none";
  }
  myFunction();
