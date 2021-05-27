// JS for educator-add-students.js

var userID;

// Create empty lists to house student names and IDs
var studentNames = [];
var studentIDs = [];
var studentsInAClass = [];

// Pull class name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Add Students to " + className);

function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    userID = doc.id;
                    getStudents();
                });
        }
    });
}

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateStudentList() {
    if (studentNames.length == 0) {
        let message = "<div class='message-container'><img src='/img/slow_down.png'>"
            + "<p class='message'>Sorry, there aren't any classless students left to add!</p></div>";
        $(".student-list").append(message);
        $(".student-list").css({
            height: "300px",
            display: "flex",
            justifyContent: "center"
        });
        $("#student-filter").remove();
        $("#card-button-container-1").remove();
    } else {
        for (var i = 0; i < studentNames.length; i++) {
            let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
            $(".student-list").append(studentContainer);
            let studentName = "<p class='student-name' id='student-name-" + i + "'>" + studentNames[i] + "</p>";
            $("#student-container-" + i).append(studentName);
            let iconContainer = "<div class='icon-container' id='icon-container-" + i + "'></div>";
            $("#student-container-" + i).append(iconContainer);
            let plusIcon = "<img src='/img/add_icon.png' class='plus-icon' id='plus-icon-" + i + "'>";
            $("#icon-container-" + i).append(plusIcon);
        }
    }
}

/**
 * Reads students' names from the Students collection and puts them into an array if they aren't already in ANY class.
 */
function getStudents() {
    db.collection("Students")
        .where("Student_Class", "==", null)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                studentNames.push(doc.data().Student_Name);
                studentIDs.push(doc.id);
            });
            populateStudentList();
        })
        .catch((error) => {
            console.log("Error getting students: ", error);
        });
}

var test

/**
 * Updates the student's Student_Class and Student_Educator attributes to the class they're being added to.
 * Also changes the "+" icon beside a student to a "-" icon and allows that student to be subsequently
 * removed from the class in question.
 */
$(document.body).on("click", ".plus-icon", function (event) {
    let index = $(event.target).attr("id");
    // Extract index from event id - 
    // taken from https://www.geeksforgeeks.org/extract-a-number-from-a-string-using-javascript/#:~:text=The%20number%20from%20a%20string,(%5Cd%2B)%2F)
    index = parseInt(index.match(/(\d+)/));
    // Replace "add" icon with a "remove" icon
    $(event.target).attr("src", "/img/remove_icon.png");
    $(event.target).attr("class", "minus-icon");
    let studentToAdd = studentIDs[index];
    // Update the student's Student_Class and Student_Educator attributes
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
 * Updates the student's Student_Class and Student_Educator attributes to null.
 * Also changes the "-" icon beside a student to a "+" icon and allows that student to be subsequently
 * added to the class in question.
 */
$(document.body).on("click", ".minus-icon", function (event) {
    // Extract index from event id
    let index = $(event.target).attr("id");
    // Extract index from event id - 
    // taken from https://www.geeksforgeeks.org/extract-a-number-from-a-string-using-javascript/#:~:text=The%20number%20from%20a%20string,(%5Cd%2B)%2F)
    index = parseInt(index.match(/(\d+)/));
    // Replace "remove" icon with an "add" icon
    $(event.target).attr("src", "/img/add_icon.png");
    $(event.target).attr("class", "plus-icon");
    let studentToRemove = studentIDs[index];
    // Update the student's Student_Class attribute
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
 * Redirects users back to the main page (or the manage class page) once they've finished adding students. 
 * Redirection depends on whether or not users are adding students to their class for the first time.
 */
function onClickSubmit() {
    setTimeout(function () {
        location.href = "./educator-manage-class.html?classname=" + className;
    }, 1000);
}


function filterByName() {
    let filter = $("#student-filter").toLowerCase();
    for (var i = 0; i < studentNames.length; i++) {
        if (studentNames[i].toLowerCase().indexOf(filter) <= -1) {
            $("#student-container-" + i).css({ display: "none" });
        }
    }
}


/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    getCurrentUser();

    /**
     * Write this.
     * Adapted from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_list
     */
    $("#student-filter").on("keyup", function () {
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

//Load Timer
//Taken from https://www.w3schools.com/howto/howto_css_loader.asp
function delayTimer() {
    setTimeout(removeSpinner, 1300);
  }
  
  function removeSpinner() {
    document.getElementById("loader").style.display = "none";
  }
  delayTimer();
