// JS for educator-remove-students.js

// Create empty lists to house student names and IDs
var currentStudents = [];
var studentIDs = [];

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
* Reads students' names and IDs from Firestore and puts them into an array if they are already in this class.
*/
function getCurrentStudents() {
    db.collection("Students")
        .where("Student_Class", "==", className)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                currentStudents.push(doc.data().Student_Name);
                studentIDs.push(doc.id);
            });
            populateStudentList();
        })
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
 * Redirects users back to the manage class page once they've finished removing students. 
 */
function onClickSubmit() {
    setTimeout(function () {
        location.href = "educator-manage-class.html?classname=" + className;
    }, 1000);
}

/**
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudents();
});
