// JS for educator-manage-tasks.js

// Create an empty list to house task IDs
var taskIDs = [];

var currentUser = null;

/**
 * Appends a list of tasks to the DOM.
 */
function populateTaskList() {
    if (taskIDs.length == 0) {
        let message = "<div class='text-container'><p class='message'>You haven't got any tasks to approve.</p></div>"
        $(".task-list").append(message);
        $(".task-list").css({ height: "150px", width: "90%", display: "flex", justifyContent: "center", justifySelf: "center"});
        let backButtonContainer = "<div class='card-button-container'></div>";
        $(".task-list").append(backButtonContainer);
        let backButton = "<a class='button' id='back-button' onclick='onClickBack()'>Back</a>";
        $(".card-button-container").append(backButton);

    } else {
        for (var i = 0; i < taskIDs.length; i++) {
            let taskContainer = "<div class='task-container' id='task-container-" + i + "'></div>";
            $(".task-list").append(taskContainer);
            let taskName = "<p class='task-name' id='" + taskIDs[i] + "' + ' onclick='onSelectTask()'>Task " + (i + 1) + "</p>";
            $("#task-container-" + i).append(taskName);
        }
    }
}

/**
 * Write this
 */
function listTasks() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.id;
                    console.log(currentUser);
                    getTasks();
                });
        }
    });
}


/**
 * Reads task IDs from Firestore and puts them into an array.
 */
function getTasks() {
    db.collection("Educators").doc(currentUser).collection("Tasks")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                taskIDs.push(doc.id);
            });
            populateTaskList();
        })
        .catch((error) => {
            console.log("Error getting tasks: ", error);
        });
}

/**
 * Redirects users to a page where they can approve or reject the selected task.
 */
function onSelectTask() {
    $(document).click(function (event) {
        let taskName = $(event.target).html();
        let  taskID = $(event.target).attr("id");
        setTimeout(function () {
            location.href = "educator-approve-task.html?taskname=" + taskName + "&taskid=" + taskID;
        }, 500);
    });
}

/**
 * Redirects users back to the the main page page.
 */
function onClickBack() {
    setTimeout(function () {
        location.href = "educator-home.html?";
    }, 1000);
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    listTasks();
});
