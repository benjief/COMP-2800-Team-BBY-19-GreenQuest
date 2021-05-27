// JS for educator-remove-students.js

var userID;

// Create empty lists to house student names and IDs
var currentStudents = [];
var studentIDs = [];

// Pull class name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Remove Students from " + className);


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
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateStudentList() {
    if (currentStudents.length == 0) {
        let message = "<div class='message-container'><img src='/img/slow_down.png'>"
            + "<p class='message'>Slow down - add some students to remove!</p></div>";
        $(".student-list").append(message);
        $(".student-list").css({
            height: "300px",
            display: "flex",
            justifyContent: "center"
        });
        $("#card-button-container-1").remove();
    } else {
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
 * Updates the student's Student_Class and Student_Educator attributes to null.
 * Also changes the "+" icon beside a student to a "-" icon and allows that student to be subsequently
 * added to the class in question.
 */
 $(document.body).on("click", ".minus-icon", function (event) {
    let index = $(event.target).attr("id");
    // Extract index from event id
    index = parseInt(index.match(/(\d+)/));
    // Extract index from event id - 
    // taken from https://www.geeksforgeeks.org/extract-a-number-from-a-string-using-javascript/#:~:text=The%20number%20from%20a%20string,(%5Cd%2B)%2F)
    $(event.target).attr("src", "/img/add_icon.png");
    $(event.target).attr("class", "plus-icon");
    let studentToRemove = studentIDs[index];
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
 * Updates the student's Student_Class attribute to the class they're being added to.
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
        // Update the student's Student_Class attribute
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
 * Redirects users back to the manage class page once they've finished removing students. 
 */
function onClickSubmit() {
    setTimeout(function () {
        location.href = "./educator-manage-class.html?classname=" + className;
    }, 1000);
}

/**
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getCurrentUser();

    /**
     * Write this.
     * Adapted from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_list
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

//Load Timer
function myFunction() {
    setTimeout(showPage, 1300);
  }
  
  function showPage() {
    document.getElementById("loader").style.display = "none";
  }
  myFunction();

