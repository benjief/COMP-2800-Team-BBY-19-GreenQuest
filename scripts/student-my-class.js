// JS for student-my-class.js

var currentStudent;
var className;
var studentsInClass = [];
var studentScores = [];

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 1.5 seconds before being hidden.
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
 * Pulls the current user's name and class name from the "Students" collection in Firestore.
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
                        displayMessage();
                    } else {
                        getStudentsInClass();
                    }
                });
        }
    });
}

/**
 * If the current student isn't in a class, a message is displayed prompting them to ask to be added to a class.
 */
function displayMessage() {
    let message = "<div class='message-container'><img src='/img/slow_down.png'>"
        + "<p class='message'>Slow down - ask your teacher to add you to their class!</p></div>";
    $(".student-list").append(message);
    $(".student-list").css({
        height: "300px",
        display: "flex",
        justifyContent: "center"
    })
    $("#before-class-total").css({ marginBottom: "15px" });
}

/** 
 * Searches for student documents whose Student_Class field matches the current class' name (i.e. other students that are 
 * in the current student's class) in Firestore's "Students" collection. Query results are ordered by student points (in 
 * descending order), before being converted into JSON objects with id, name and points fields, and pushed to the 
 * studentsInClass array.
 */
 function getStudentsInClass() {
    db.collection("Students")
        .where("Student_Class", "==", className)
        .orderBy("Student_Points", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let studentObject = { "id": doc.id, "name": doc.data().Student_Name, "points": doc.data().Student_Points.toString() };
                studentsInClass.push(studentObject);
            });
            getScores();
            populateStudentList(currentStudent);
            addHeading();
        })
}


/**
 * Adds the current class' name to the page header.
 */
 function addHeading() {
    $(".page-heading").html(className);
}

/**
 * Populates the studentScores array with the scores field of each student in studentsInClass.
 * Sorting algorithm taken directly from @author w3schools
 * @see https://www.w3schools.com/js/js_array_sort.asp
 */
 function getScores() {
    for (var i = 0; i < studentsInClass.length; i++) {
        studentScores.push(studentsInClass[i].points);
    }
    studentScores.sort(function (a, b) { return b - a });
}

/**
 * Creates elements to be pushed to the DOM in the form of a student list, with student names, points and placements displayed
 * for each entry. Notably, an anchor element is created for each student so that any student can access another student's profile
 * page by clicking on an entry. Also adds up all of the students in this class' points as each element is created, so that by the 
 * time this function is finished running, classTotalPoints contains the class' total points.
 */
function populateStudentList(currentStudent) {
    var classTotalPoints = 0;
    for (var i = 0; i < studentsInClass.length; i++) {
        let studentProfileLink = "./student-profile.html?userid=" + studentsInClass[i].id;
        let studentContainer = "<a class='student-container' id='student-container-" + i + "' href='" + studentProfileLink + "'></a>";
        $(".student-list").append(studentContainer);
        let placeContainer = "<div class='place-container' id='place-container-" + i + "'></div>";
        $("#student-container-" + i).append(placeContainer);
        let studentPlacement = studentScores.indexOf(studentsInClass[i].points) + 1;
        let place = "<p>" + studentPlacement + "</p>";
        $("#place-container-" + i).append(place);
        let studentName = "<p class='student-name' id='student-name-" + i + "'>" + studentsInClass[i].name + "</p>";
        $("#student-container-" + i).append(studentName);
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
 * Creates, appends and displays a DOM element showing the class' total score at the bottom of the student list
 * generated above.
 * 
 * @param {*} classTotalPoints - The class' total points.
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
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();
});
