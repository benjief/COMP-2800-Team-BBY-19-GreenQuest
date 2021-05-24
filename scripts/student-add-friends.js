// JS for student-add-friends.js

// Pull quest IDs from URL
const parsedUrl = new URL(window.location.href);
var questID = parsedUrl.searchParams.get("questid");
var uniquequestID = parsedUrl.searchParams.get("uniquequestid");

var currentUser = null;

var allStudents = [];
var studentsToAdd = [];
var IDsToAdd = [];

const maxStudentsToAdd = 3;

function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Students")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.id;
                    getStudents();
                });
        }
    });
}

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateStudentList() {
    if (allStudents.length == 0) {
        let message = "<div class='message-container'><img src='/img/slow_down.png'>"
            + "<p class='message'>Sorry, there aren't any other students currently in classes!</p></div>";
        $(".student-list").append(message);
        $(".student-list").css({
            height: "300px",
            display: "flex",
            justifyContent: "center"
        });
        $("#student-filter").remove();
        $("#card-button-container-1").remove();
    } else {
        for (var i = 0; i < allStudents.length; i++) {
            let studentContainer = "<div class='student-container' id='student-container-" + i + "'></div>";
            $(".student-list").append(studentContainer);
            let studentName = "<p class='student-name' id='student-name-" + i + "'>" + allStudents[i].name + "</p>";
            $("#student-container-" + i).append(studentName);
            let iconContainer = "<div class='icon-container' id='icon-container-" + i + "'></div>";
            $("#student-container-" + i).append(iconContainer);
            let plusIcon = "<img role='button' src='/img/add_icon.png' class='plus-icon' id='plus-icon-" + i + "'>";
            $("#icon-container-" + i).append(plusIcon);
        }
    }
}

/**
 * Reads other students' names from the Students collection and puts them into an array.
 */
function getStudents() {
    db.collection("Students")
        .where(firebase.firestore.FieldPath.documentId(), "!=", currentUser)
        .get()

        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let student = { "name": doc.data().Student_Name, "id": doc.id };
                allStudents.push(student);
            });
            populateStudentList();
        })
        .catch((error) => {
            console.log("Error getting students: ", error);
        });
}

/**
 * Write this.
 */
function checkNumAdded() {
    if (studentsToAdd.length == maxStudentsToAdd) {
        for (var i = 0; i < allStudents.length; i++) {
            if ($("#plus-icon-" + i).attr("class") === "plus-icon") {
                console.log("wtf");
                $("#plus-icon-" + i).attr("onclick", "");
                $("#plus-icon-" + i).attr("src", "/img/add_icon_grey.png");
            }
        }
    } else {
        for (var i = 0; i < allStudents.length; i++) {
            if ($("#plus-icon-" + i).attr("src") === "/img/add_icon_grey.png") {
                console.log("wtf");
                $("#plus-icon-" + i).attr("onclick", "addStudent()");
            }
        }
    }
}

/**
 * Adds the student's name to the studentsToAdd array and their ID to the IDsToAdd array. 
 * Also changes the "+" icon beside a student to a "-" icon and allows that student's name/ID to be 
 * subsequently removed from the aforementioned arrays.
 */
$(document.body).on("click", ".plus-icon", function (event) {
    let index = $(event.target).attr("id");
    // Extract index from event id (CITE THIS CODE)
    index = index.match(/\d+/);
    // Replace "add" icon with a "remove" icon
    $(event.target).attr("src", "/img/remove_icon.png");
    $(event.target).attr("class", "minus-icon");
    // Get "remove" icon to call removeStudent()
    // $(event.target).attr("onclick", "removeStudent()");
    studentsToAdd.push(allStudents[index].name);
    console.log(studentsToAdd);
    IDsToAdd.push(allStudents[index].id);
    console.log(studentsToAdd.length);
    console.log("add");
    checkNumAdded();
});

/**
 * Removes the student's name from the studentsToAdd array and their ID to the IDsToAdd array. 
 * Also changes the "-" icon beside a student to a "+" icon and allows that student's name/ID to be 
 * subsequently added back to the aforementioned arrays.
 */
$(document.body).on("click", ".minus-icon", function (event) {
    console.log("remove");
    let index = $(event.target).attr("id");
    // Extract index from event id
    index = index.match(/\d+/);
    let indexOfStudent = studentsToAdd.indexOf(allStudents[index].name);
    // console.log(in/dexOfStudent);
    studentsToAdd.splice(indexOfStudent, 1);
    console.log(studentsToAdd);
    // Get "add" icon to call addStudent()
    $(event.target).removeAttr("onclick");
    // Replace "remove" icon with an "add" icon
    $(event.target).attr("src", "/img/add_icon.png");
    $(event.target).attr("class", "plus-icon");
    console.log(studentsToAdd.length);
    checkNumAdded();
});

/**
 * Write this.
 */
function updateQuest() {
    // Update the student's quest document
    db.collection("Students").doc(currentUser).collection("Quests").doc(questID).update({
        Quest_Participants: studentsToAdd,
        Quest_Participant_IDs: IDsToAdd
    })
        .then(() => {
            console.log("Quest participants successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating quest participants ", error);
        });
}

/**
 * Write this.
 */
function onClickSubmit() {
    updateQuest();
    setTimeout(function () {
        window.location.assign("./student-submit-quest.html");
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
        for (var i = 0; i < allStudents.length; i++) {
            if (allStudents[i].name.toLowerCase().indexOf(filter) <= -1) {
                $("#student-container-" + i).css({ display: "none" });
            } else {
                $("#student-container-" + i).css({ display: "" });
            }
        }
    })
});