// JS for student-add-friends.js

// Pull current quest ID (i.e. of quest being submitted) from URL
const parsedUrl = new URL(window.location.href);
var questID = parsedUrl.searchParams.get("questid");

var currentUser;
var currentUserID;
var allStudents = [];
var studentsToAdd = [];
var IDsToAdd = [];
var questParticipants;
var questParticipantIDs;
var maxStudentsToAdd = 3;
var maxStudentsReached = false;

/**
 * Pulls the current user's ID and name from the "Students" collection in Firestore, assigning them to
 * currentUserID and currentUser, respectively, before calling getQuestParticipantInfo().
 */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Students")
                .doc(user.uid)
                .get()
                .then(function (doc) {
                    currentUserID = doc.id;
                    currentUser = doc.data().Student_Name;
                    getQuestParticipantInfo();
                });
        }
    });
}

/**
 * Searches the "Student_Quests" collection in Firestore for and ID that matches the quest currently being
 * submitted. Once it's retrieved, quest participants and quest participant IDs are pulled and assigned to
 * appropriately-named variables. Then, the maximum number of students that can be added to the quest is
 * calculated (3 is the absolute max). Finally, a header specifying the number of students that can be added
 * to the quest is displayed in the card header.
 */
function getQuestParticipantInfo() {
    db.collection("Student_Quests").doc(questID)
        .get()
        .then(function (doc) {
            questParticipants = doc.data().Quest_Participants;
            questParticipantIDs = doc.data().Quest_Participant_IDs;
            /* 1 is subtracted from questParticipants.length, since the primary submitter is also 
               included in that list */
            maxStudentsToAdd = 3 - (questParticipants.length - 1);
            $("#card-header").html("Add up to " + maxStudentsToAdd + " friends from the list below:");
            getStudents();
        });
}

/**
 * Searches the "Students" collection in Firestore for students who aren't already quest participants (in this quest, 
 * or otherwise), and pushes the query results to the allStudents array as JSON objects (containing name and id fields).
 */
function getStudents() {
    db.collection("Students")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.id != currentUserID && !questParticipantIDs.includes(doc.id)) {
                    let student = { "name": doc.data().Student_Name, "id": doc.id };
                    allStudents.push(student);
                }
            });
            console.log(allStudents);
            populateStudentList();
        })
        .catch((error) => {
            console.log("Error getting students: ", error);
        });
}

/**
 * Appends a list of student names (along with a "+" icon) to the DOM. If no students are available to add
 * to the quest, a message is displayed that explains what's going on.
 */
function populateStudentList() {
    // If no students are available to add, push a message to the DOM
    if (allStudents.length == 0) {
        displayMessage();
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
 * Constructs and pushes a message to the DOM stating that there are no more students left to add to this
 * quest. Also removes the student filter and "Submit" buttons from the page (since they have no use without
 * students).
 */
function displayMessage() {
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
}

/**
 * If the number of students added to this quest is equal to the maximum number allowed, "+" buttons for all remaining
 * students on the list are greyed out and made inactive. If the number of students added is less than the maximum number
 * allowed, add buttons become active again.
 */
function checkNumAdded() {
    if (studentsToAdd.length == maxStudentsToAdd) {
        maxStudentsReached = true;
        deactivateAddButton();
        for (var i = 0; i < allStudents.length; i++) {
            if ($("#plus-icon-" + i).attr("class") === "plus-icon") {
                $("#plus-icon-" + i).attr("src", "/img/add_icon_grey.png");
            }
        }
    } else {
        if (maxStudentsReached) {
            maxStudentsReached = false;
            activateAddButton();
            for (var i = 0; i < allStudents.length; i++) {
                if ($("#plus-icon-" + i).attr("src") === "/img/add_icon_grey.png") {
                    $("#plus-icon-" + i).attr("src", "/img/add_icon.png");
                }
            }
        }
    }
}

/**
 * Adds the selected student's name to the studentsToAdd array and their ID to the IDsToAdd array. 
 * Also changes the "+" icon beside a student to a "-" icon and allows that student's name/ID to be 
 * subsequently removed from the aforementioned arrays. Once a student is added, the total number of 
 * students added is checked to properly adjust the DOM, if needed.
 */
function activateAddButton() {
    $(document.body).on("click", ".plus-icon", function (event) {
        let index = $(event.target).attr("id");
        // Extract index from event id (CITE THIS CODE)
        index = parseInt(index.match(/(\d+)/));
        // Replace "add" icon with a "remove" icon
        $(event.target).attr("src", "/img/remove_icon.png");
        $(event.target).attr("class", "minus-icon");
        // Get "remove" icon to call removeStudent()
        studentsToAdd.push(allStudents[index].name);
        console.log(studentsToAdd);
        IDsToAdd.push(allStudents[index].id);
        console.log(studentsToAdd);
        console.log(IDsToAdd);
        // Check the number of students added
        checkNumAdded();
    });
}

/**
 * Deactivates all remaining "+" buttons (i.e. removes their "on-click" functionality).
 */
function deactivateAddButton() {
    $(document.body).off("click", ".plus-icon");
}


/**
 * Removes the student's name from the studentsToAdd array and their ID to the IDsToAdd array. 
 * Also changes the "-" icon beside a student to a "+" icon and allows that student's name/ID to be 
 * subsequently added back to the aforementioned arrays. Once a student is removed, the total number of 
 * students added is checked to properly adjust the DOM, if needed.
 */
function activateRemoveButton() {
    $(document.body).on("click", ".minus-icon", function (event) {
        console.log("remove");
        let index = $(event.target).attr("id");
        // Extract index from event id
        index = parseInt(index.match(/(\d+)/));
        let indexOfStudent = studentsToAdd.indexOf(allStudents[index].name);
        // console.log(in/dexOfStudent);
        studentsToAdd.splice(indexOfStudent, 1);
        IDsToAdd.splice(indexOfStudent, 1);
        console.log(studentsToAdd);
        console.log(IDsToAdd);
        // Get "add" icon to call addStudent()
        // Replace "remove" icon with an "add" icon
        $(event.target).attr("src", "/img/add_icon.png");
        $(event.target).attr("class", "plus-icon");
        console.log(studentsToAdd.length);
        checkNumAdded();
    });
}

/**
 * When a user clicks the "Submit" button, the updateQuest() function is called.
 */
function onClickSubmit() {
    updateQuest();
}


/**
 * After a user clicks the "Submit" button, the current quest participants are merged with the quest participants
 * added during this session (questParticipants stores student names and questParticipantIDs stores student IDs).
 * Once these arrays are concatenated, the quest document in the "Student_Quests" Firestore collection is updated
 * (namely the Quest_Participants and Quest_Participant_IDs fields) to reflect these changes. Finally, the user is
 * redirected back to the "Submit Quest" page from whence they came (with the quest ID and a redirect flag stored
 * in a URL query string - the latter of which is used to pull items from session storage).
 */
function updateQuest() {
    let updatedQuestParticipants = questParticipants.concat(studentsToAdd);
    let updatedQuestParticipantIDs = questParticipantIDs.concat(IDsToAdd);
    // Update the quest document
    db.collection("Student_Quests").doc(questID).update({
        Quest_Participants: updatedQuestParticipants,
        Quest_Participant_IDs: updatedQuestParticipantIDs
    })
        .then(() => {
            console.log("Quest participants successfully updated!");
            setTimeout(function () {
                window.location.assign("./student-submit-quest.html?questid=" + questID + "&redirectflag=true");
            }, 1000);
        })
        .catch((error) => {
            console.error("Error updating quest participants ", error);
        });
}

/**
 * Clicking on the "Back" button takes a user back to the "Submit Quest" page that led them here. A URL query string
 * containing the quest ID and a redirect flag (used to pull items from session storage) are attached to the redirect
 * link.
 */
function onClickBack() {
    setTimeout(function () {
        window.location.assign("./student-submit-quest.html?questid=" + questID + "&redirectflag=true");
    }, 1000);
}

/**
 * Calls getCurrentUser(), activateAddButton() and activateRemoveButton() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentUser();
    activateAddButton();
    activateRemoveButton();

    /**
    * When a string is typed into the DOM filter input, if that string isn't contained in a student's name
    * (case insensitive), the name is hidden and disappears from the list.
    * Adapted from code by @author w3schools
    * @see https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_list
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
