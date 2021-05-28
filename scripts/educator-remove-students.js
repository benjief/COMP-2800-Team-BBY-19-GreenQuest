// JS for educator-remove-students.js

var userID;
var currentStudents = [];
var studentIDs = [];

// Pull class name from URL and display it in the DOM (as a heading)
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Remove Students from " + className);

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
 * Pulls the current educator's ID from Firestore.
 */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    userID = doc.id;
                    getCurrentStudents();
                });
        }
    });
}

/**
 * Reads students' names and IDs from the "Students" collection in Firestore and puts them into 
 * an array if they are in the current user's class.
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
 * Appends a list of student names (along with a "+" icon) to the DOM. The "+" icon allows students
 * to be added to the class that is currently being modified. If no students are available to add,
 * a message is displayed specifying this (although users shouldn't easily end up on the "Add Students" page
 * if there aren't any classless students left in the database).
 */
function populateStudentList() {
    if (currentStudents.length == 0) {
        // Push a message to the DOM if there aren't any students in the educator's class
        let message = "<div class='message-container'><img src='/img/slow_down.png'>"
            + "<p class='message'>Slow down - add some students to remove!</p></div>";
        $(".student-list").append(message);
        $(".student-list").css({
            height: "300px",
            display: "flex",
            justifyContent: "center"
        });
        /* Get rid of the filter element and "Submit" button, since they are of no use when there
           aren't any students to display */
        $("#student-filter").remove();
        $("#card-button-container-1").remove();
    } else {
        // If there are students to remove, populate and push a list containing their names to the DOM
        for (var i = 0; i < currentStudents.length; i++) {
            let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
            $(".student-list").append(studentContainer);
            let studentName = "<p class='student-name' id='student-name-" + i + "'>" + currentStudents[i] + "</p>";
            $("#student-container-" + i).append(studentName);
            let iconContainer = "<div class='icon-container' id='icon-container-" + i + "'></div>";
            $("#student-container-" + i).append(iconContainer);
            let plusIcon = "<img src='/img/remove_icon.png' class='minus-icon' id='minus-icon-" + i + "'>";
            $("#icon-container-" + i).append(plusIcon);
        }
    }
}

/**
 * Updates the student's Student_Class and Student_Educator attributes to null.
 * Also changes the "-" icon beside a student to a "+" icon and allows that student to be subsequently
 * added back to the class in question.
 */
$(document.body).on("click", ".minus-icon", function (event) {
    let index = $(event.target).attr("id");
    index = parseInt(index.match(/(\d+)/));
    // Replace "remove" icon with an "add" icon and change its class
    $(event.target).attr("src", "/img/add_icon.png");
    $(event.target).attr("class", "plus-icon");
    let studentToRemove = studentIDs[index];
    // Update the student's Student_Class and Student_Educator attributes
    db.collection("Students").doc(studentToRemove).update({
        Student_Class: null,
        Student_Educator: null
    })
        .then(() => {
            console.log("Student successfully removed from this class!");
        })
        .catch((error) => {
            console.error("Error removing student from this class: ", error);
        });
});

/**
 * Updates the student's Student_Class and Student_Educator fields in Firestore to the class they're being added to.
 * Also changes the "+" icon beside a student to a "-" icon and allows that student to be subsequently
 * removed from the class in question.
 */
$(document.body).on("click", ".plus-icon", function (event) {
    let index = $(event.target).attr("id");
    index = parseInt(index.match(/(\d+)/));
    // Replace "add" icon with a "remove" icon and change its class back to what it was before
    $(event.target).attr("src", "/img/remove_icon.png");
    $(event.target).attr("class", "minus-icon");
    let studentToAdd = studentIDs[index];
    db.collection("Students").doc(studentToAdd).update({
        Student_Class: className,
        Student_Educator: userID
    })
        .then(() => {
            console.log("Student successfully added to this class!");
        })
        .catch((error) => {
            console.error("Error adding student to this class: ", error);
        });
});

/**
 * Redirects users back to the "Manage Class" page once they've finished removing students. 
 */
function onClickSubmit() {
    setTimeout(function () {
        location.href = "./educator-manage-class.html?classname=" + className;
    }, 1000);
}

/**
 * Calls getCurrentUser() and starts the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentUser();

    /**
     * When a string is typed into the DOM filter input, if that string isn't contained in a student's name
     * (case insensitive), the name is hidden and disappears from the list.
     * Adapted from code by @author w3schools
     * @see https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_list
     */
    $("#student-filter").on("keyup", function () {
        let filter = $("#student-filter").prop("value").toLowerCase();
        for (var i = 0; i < currentStudents.length; i++) {
            if (currentStudents[i].toLowerCase().indexOf(filter) <= -1) {
                $("#student-container-" + i).css({ display: "none" });
            } else {
                $("#student-container-" + i).css({ display: "" });
            }
        }
    })
});
