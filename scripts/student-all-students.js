// JS for student-all-students.js

var currentStudent = null;
var students = [];
var firstPlace = 0;
var secondPlace = 0;
var thirdPlace = 0;
var studentScores = [];

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 500 milliseconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
 function delayTimer() {
    setTimeout(removeSpinner, 1300);
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
                    // Extract the current student's name
                    currentStudent = doc.data().Student_Name;
                    getStudents();
                });
        }
    });
}

/**
 * Write this.
 */
function populateStudentList(currentStudent) {
    for (var i = 0; i < students.length; i++) {
        let studentProfileLink = "./student-profile.html?userid=" + students[i].id;
        let studentContainer = "<a class='student-container' id='student-container-" + i + "' href='" + studentProfileLink + "'></a>";
        $(".student-list").append(studentContainer);
        let ribbonContainer = "<div class='ribbon-container' id='ribbon-container-" + i + "'></div>";
        $("#student-container-" + i).append(ribbonContainer);
        if (students[i].points == firstPlace) {
            var ribbon = "<img src='/img/gold_ribbon.png'>";
        } else if (students[i].points == secondPlace) {
            var ribbon = "<img src='/img/silver_ribbon.png'>";
        } else if (students[i].points == thirdPlace) {
            var ribbon = "<img src='/img/bronze_ribbon.png'>";
        } else {
            let studentPlacement = studentScores.indexOf(students[i].points) + 1;
            ribbon = "<p class='student-placement'>" + studentPlacement + "</p>";
        }
        $("#ribbon-container-" + i).append(ribbon);
        let studentName = "<p class='student-name' id='student-name-" + i + "'>" + students[i].name + "</p>";
        $("#student-container-" + i).append(studentName);
        // Different container color for student
        if (students[i].name == currentStudent) {
            $("#student-container-" + i).addClass("current-student-container");
        }
        let studentPoints = "<p class='student-points' id='student-points-" + i + "'>" + students[i].points + "</p>";
        $("#student-container-" + i).append(studentPoints);

        let leafIcon = "<img id='leaf-icon' src='/img/leaf_icon.png'>"
        $("#student-container-" + i).append(leafIcon);
    }
}

/**
 * Write this.
 * Taken from https://www.w3schools.com/js/js_array_sort.asp (sorting algorithm)
 */
function getTopScores() {
    for (var i = 0; i < students.length; i++) {
        studentScores.push(students[i].points);
    }
    studentScores.sort(function (a, b) { return b - a });
    studentScoresSet = new Set(studentScores);
    let iterator = studentScores.values();
    if (studentScoresSet.size >= 3) {
        firstPlace = iterator.next().value;
        secondPlace = iterator.next().value;
        thirdPlace = iterator.next().value;
    } else if (studentScoresSet == 2) {
        firstPlace = iterator.next().value;
        secondPlace = iterator.next().value;
    } else if (studentScoresSet == 1) {
        firstPlace = iterator.next().value;
    }
    populateStudentList(currentStudent);
}

/** 
 * Reads the students' names and scores from Firestore and puts them into an array.
 */
function getStudents() {
    db.collection("Students")
        .orderBy("Student_Points", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let studentObject = { "id": doc.id, "name": doc.data().Student_Name, "points": doc.data().Student_Points.toString() };
                students.push(studentObject);
            });
            getTopScores();
        })
}

/**
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();

    /**
     * When a string is typed into the DOM filter input, if that string isn't contained in a student's name
     * (case insensitive), the name is hidden and disappears from the list. In this instance, I've had to create
     * a list of student names to use for the filter, since I didn't already have one.
     * Adapted from code by @author w3schools
     * @see https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_list
     */
    $("#student-filter").on("keyup", function () {
        let studentNames = [];
        for (var i = 0; i < students.length; i++) {
            studentNames[i] = students[i].name;
        }

        let filter = $("#student-filter").prop("value").toLowerCase();
        for (var i = 0; i < studentNames.length; i++) {
            if (studentNames[i].toLowerCase().indexOf(filter) <= -1) {
                $("#student-container-" + i).css({ display: "none" });
            } else {
                $("#student-container-" + i).css({ display: "" });
            }
        }
    })
});
