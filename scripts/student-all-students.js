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
 * Pulls the current user's name from the "Students" collection in Firestore.
 */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    currentStudent = doc.data().Student_Name;
                    getStudents();
                });
        }
    });
}

/** 
 * Reads all students' names and scores from Firestore, orders them by points (descending), creates JSON objects out of their
 * IDs, names and point totals, and stores them in the students array.
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
 * Pushes student points to an array and then sorts them in descending order. Once this is done, a set is created (so that only
 * unique values are stored) and used to determine first, second and third places (i.e. the highest, second highest and third
 * highest scores). Finally, these are stored in appropriately-named variables.
 * Sorting algorithm taken directly from @author w3schools
 * @see https://www.w3schools.com/js/js_array_sort.asp
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
 * Creates elements to be pushed to the DOM in the form of a student list, with student names, points and placements displayed
 * for each entry. Notably, an anchor element is created for each student so that any student can access another student's profile
 * page by clicking on an entry.
 */
function populateStudentList(currentStudent) {
    for (var i = 0; i < students.length; i++) {
        let studentProfileLink = "./student-profile.html?userid=" + students[i].id;
        let studentContainer = "<a class='student-container' id='student-container-" + i + "' href='" + studentProfileLink + "'></a>";
        $(".student-list").append(studentContainer);
        createRibbons(i);
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
 * Creates a ribbon container, which houses a ribbon image if the student has a top 3 score. If the student is outside of the
 * top 3, they are assigned a placement based on the sorted studentScores array, and that number is displayed beside their name
 * (in place of a ribbon).
 * 
 * @param {*} i - The index of the student in the students array that is currently being processed
 */
function createRibbons(i) {
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
}

/**
 * Calls getCurrentStudent() to start the function cascade when the page is ready.
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
