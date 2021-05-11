// JS for educator-remove-students.js

// Create empty lists to house student names
var currentStudents = [];

// Pull class name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Remove Students from " + className);

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateStudentList() {
    if (currentStudents.length == 0) {
        let message = "<p class='message'>There are no students to remove!</p>"
        $(".student-list").append(message);
        $("#submit-button").html("Back");
    } else {
        for (var i = 0; i < currentStudents.length; i++) {
            let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
            $(".student-list").append(studentContainer);
            let studentName = "<p class='student-name' id='student-name-" + i + "'>" + currentStudents[i] + "</p>";
            $("#student-container-" + i).append(studentName);
            let iconContainer = "<div class='icon-container' id='icon-container-" + i + "'></div>";
            $("#student-container-" + i).append(iconContainer);
            let plusIcon = "<img src='/img/remove_icon.png' class='icon' id='minus-icon-" + i
                + "' onclick='removeStudent()'>";
            $("#icon-container-" + i).append(plusIcon);
        }
    }
}

/** 
* Reads students' names from Firestore and puts them into an array if they aren't already in this class.
 */
function getCurrentStudents() {
    db.collection("Classes").doc(className).collection("Students")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                currentStudents.push(doc.data().id);
            });
            populateStudentList();
        })
}

/**
 * Removes the chosen student from a collection in Firestore (nested under the class being removed from).
 * Also changes the "-" icon beside a student to a "+" icon and allows that student to be subsequently
 * re-added to the class in question.
 */
function removeStudent(event) {
    $(document).click(function (event) {
        let index = $(event.target).attr("id");
        // Extract index from event id
        index = index.match(/\d+/);
        // Replace "remove" icon with an "add" icon
        $(event.target).attr("src", "/img/add_icon.png");
        // Get "add" icon to call addStudent()
        $(event.target).attr("onclick", "addStudent()");
        // Remove student from collection in Firestore
        let studentToRemove = currentStudents[index];
        db.collection("Classes").doc(className).collection("Students").doc(studentToRemove).delete()
            .then(() => {
                console.log("Student successfully removed!");
            })
            .catch((error) => {
                console.error("Error removing student: ", error);
            })
    });
}

/**
 * Adds the chosen student to a collection in Firestore (nested under the class being added to).
 * Also changes the "+" icon beside a student to a "-" icon and allows that student to be subsequently
 * removed from the class in question.
 */
function addStudent() {
    $(document).click(function (event) {
        let index = $(event.target).attr("id");
        // Extract index from event id
        index = index.match(/\d+/);
        // Replace "add" icon with a "remove" icon
        $(event.target).attr("src", "/img/remove_icon.png");
        // Get "remove" icon to call removeStudent()
        $(event.target).attr("onclick", "removeStudent()");
        // Add student to a collection in Firestore (nested under the class being added to)
        let studentToAdd = currentStudents[index];
        db.collection("Classes").doc(className).collection("Students").doc(studentToAdd).set({
            id: studentToAdd
        })
            .then(() => {
                console.log("Student successfully written!");
            })
            .catch((error) => {
                console.error("Error adding student: ", error);
            });
    });
}

/**
 * Redirects users back to the manage class page once they've finished removing students. 
 */
function onClickSubmit() {
    setTimeout(function () {
        location.href = "educator-manage-class.html?classname=" + className;
    }, 1000);
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    getCurrentStudents();
});
