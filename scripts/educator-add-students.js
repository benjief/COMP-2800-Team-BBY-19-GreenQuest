// JS for educator-add-students.js

// Create empty lists to house student names and IDs
var studentNames = [];
var studentIDs = [];
var currentStudents = [];

// Pull class name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Add Students to " + className);

// Pull redirect flag from URL
var redirectFlag = parsedUrl.searchParams.get("redirectflag");

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateStudentList() {
    if (studentNames.length == 0) {
        let message = "<p class='message'>There are no more students to add!</p>"
        $(".student-list").append(message);
        $("#submit-button").html("Back");
    } else {
        for (var i = 0; i < studentNames.length; i++) {
            let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
            $(".student-list").append(studentContainer);
            let studentName = "<p class='student-name' id='student-name-" + i + "'>" + studentNames[i] + "</p>";
            $("#student-container-" + i).append(studentName);
            let iconContainer = "<div class='icon-container' id='icon-container-" + i + "'></div>";
            $("#student-container-" + i).append(iconContainer);
            let plusIcon = "<img src='/img/add_icon.png' class='icon' id='plus-icon-" + i
                + "' onclick='addStudent()'>";
            $("#icon-container-" + i).append(plusIcon);
        }
    }
}

/** 
 * Gets the names of students who are already in this class.
 */
function getCurrentStudents() {
    db.collection("Students")
        .where("Student_Class", "==", className)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                currentStudents.push(doc.data().Student_Name);
            });
            getStudents();
            console.log(currentStudents);
        })
}

/**
 * Reads students' names from the Students collection and puts them into an array if they aren't already in this class.
 */
function getStudents() {
    db.collection("Students")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (!currentStudents.includes(doc.data().Student_Name)) {
                    studentNames.push(doc.data().Student_Name);
                    studentIDs.push(doc.id);
                }
            });
            populateStudentList();
        })
        .catch((error) => {
            console.log("Error getting students: ", error);
        });
}

/**
 * Updates the student's Student_Class attribute to the class they're being added to.
 * Also changes the "+" icon beside a student to a "-" icon and allows that student to be subsequently
 * removed from the class in question.
 */
function addStudent() {
    $(document).click(function (event) {
        let index = $(event.target).attr("id");
        // Extract index from event id (CITE THIS CODE)
        index = index.match(/\d+/);
        // Replace "add" icon with a "remove" icon
        $(event.target).attr("src", "/img/remove_icon.png");
        // Get "remove" icon to call removeStudent()
        $(event.target).attr("onclick", "removeStudent()");
        let studentToAdd = studentIDs[index];
        console.log(studentToAdd);
        // Update the student's Student_Class attribute
        db.collection("Students").doc(studentToAdd).update({
            Student_Class: className
        })
            .then(() => {
                console.log("Student successfully added to this class!");
            })
            .catch((error) => {
                console.error("Error adding student to this class: ", error);
            });
    });
}

/**
 * Updates the student's Student_Class attribute to null.
 * Also changes the "+" icon beside a student to a "-" icon and allows that student to be subsequently
 * added to the class in question.
 */
function removeStudent() {
    $(document).click(function (event) {
        let index = $(event.target).attr("id");
        // Extract index from event id
        index = index.match(/\d+/);
        // Replace "remove" icon with an "add" icon
        $(event.target).attr("src", "/img/add_icon.png");
        // Get "add" icon to call addStudent()
        $(event.target).attr("onclick", "addStudent()");
        let studentToRemove = studentIDs[index];
        // Update the student's Student_Class attribute
        db.collection("Students").doc(studentToRemove).update({
            Student_Class: null
        })
            .then(() => {
                console.log("Student successfully added to this class!");
            })
            .catch((error) => {
                console.error("Error adding student to this class: ", error);
            });
    });
}

/**
 * Redirects users back to the main page (or the manage class page) once they've finished adding students. 
 * Redirection depends on whether or not users are adding students to their class for the first time.
 */
function onClickSubmit() {
    setTimeout(function () {
        if (!redirectFlag) {
            location.href = "educator-home.html";
        } else {
            location.href = "educator-manage-class.html?classname=" + className;
        }

    }, 1000);
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    getCurrentStudents();
});
