
// JS for student-choose-task.js

var taskIDs = [];
var currentTaskID = null;
var taskTitle;
var taskDescription;
var taskInstructions;
var taskInfo;
var bitmojiURL;
var userName;
var className;
var educatorName;
var userID;

/* Get the current user's name, class name, educator name, and ID from Firestore. */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current student's class name
                    userName = doc.data().Student_Name;
                    className = doc.data().Student_Class;
                    educatorName = doc.data().Student_Educator;
                    userID = doc.id;
                    if (className == null) {
                        // Display a message on the page if the student isn't in a class
                        $("#main-content-card > .text-container").remove();
                        $("#main-content-card > .image-container").remove();
                        let message = "<div class='text-container' id='message-container'><p id='message'>"
                            + "You haven't been added to a class yet!</p></div>";
                        $("#main-content-card").append(message);
                        $(".page-heading").html("No Class!");
                        $("#message-container").css({ width: "90%", fontWeight: "600", justifySelf: "center" });
                        $("#card-button-container-2").remove();
                        $("#accept-button").removeAttr("onclick");
                        $("#accept-button").attr("href", "./student-home.html");
                        $("#accept-button").html("Home");
                        $(".card-button-container").css({ marginBottom: "30px" });
                    }
                    getTaskIDs();
                });
        }
    });
}

/**
 * Write this
 */
function getTaskIDs() {
    db.collection("Tasks")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                taskIDs.push(doc.id);
            })
            let numOfTasks = taskIDs.length;
            let randomNum = Math.floor(Math.random() * numOfTasks);
            currentTaskID = taskIDs[randomNum];
            getTask(currentTaskID);
        })
        .catch((error) => {
            console.log("Error getting task ID: ", error);
        });
}

/**
 * Write this.
 */
function getTask(taskID) {

    db.collection("Tasks").doc(taskID)
        // Read
        .get()
        .then(function (doc) {
            currentTaskID = doc.id;
            taskTitle = doc.data().title;
            taskDescription = doc.data().description;
            taskInstructions = doc.data().instruction;
            taskInfo = doc.data().moreInfo;
            getBitmoji();
        });
}

/**
 * Write this.
 * 
 */
function getBitmoji() {
    let counter = 0;
    let storageRef = storage.ref();
    folderRef = storageRef.child("images/bitmojis");
    folderRef.listAll()
        // Workaround for getting the number of images in the folder
        .then((res) => {
            res.items.forEach(() => {
                counter++;
            });
            let randomNum = Math.floor(Math.random() * counter + 1);
            storageRef.child("images/bitmojis/" + randomNum.toString() + ".png").getDownloadURL()
                .then((url) => {
                    bitmojiURL = url;
                    // bitmojiURL = imageRef.getDownloadURL();
                    addInfoToDOM();
                })
                .catch((error) => {
                    console.error("Error getting url: ", error);
                })
        })
        .catch((error) => {
            console.error("Error getting number of bitmojis: ", error);
        });
}

/**
 * Write this.
 */
function addInfoToDOM() {
    let title = "<p id='task-title'>" + taskTitle + "</p>";
    $("#task-title-container").append(title);
    let description = "<p id='task-description'>Your Quest:<br />" + taskDescription + "</p>";
    $("#task-description-container").append(description);
    let bitmoji = "<img src='" + bitmojiURL + "'>";
    $(".image-container").append(bitmoji);
    getBitmojiBackground();
    let instructions = "<a id='task-instructions' onclick='showVideo(this)'"
        + "data-bs-toggle='modal' data-bs-target='#videoViewer'>Instructions</a>";
    $("#task-instructions-container").append(instructions);
    let info = "<a id='task-information' onclick='showVideo(this)'"
        + "data-bs-toggle='modal' data-bs-target='#videoViewer'>More Information</a>";
    $("#task-information-container").append(info);
}

/**
 * Write this.
 * 
 * @param {*} element 
 */
function showVideo(element) {
    let category = $(element).attr("id");
    let videoURL = null;
    let videoTitle = null;

    if (category === "task-instructions") {
        videoURL = taskInstructions;
        videoTitle = "Instructions";

    } else {
        videoURL = taskInfo;
        videoTitle = "More Information";
    }

    $(".modal-body").html("");

    if (videoURL) {
        $(".modal-title").html(videoTitle);
        $(".modal-body").html("<iframe src='" + videoURL + "' allowfullscreen>");
    } else {
        $(".modal-title").html("No video available");
        $(".modal-body").html("Sorry, we couldn't generate a video for you.");
    }
}

/**
 * Write this.
 */
function getBitmojiBackground() {
    let randomNum = Math.floor(Math.random() * 5 + 3);
    $(".image-container").css({ background: "url('../img/background_pattern_" + randomNum + ".png')" });
}

/**
 * CITE and write this 
 * (https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript?page=1&tab=votes#tab-top)
 */
function pseudorandomID() {
    let generatedID = Math.random().toString(36).replace(/[^a-z\d]+/g, '').substr(0, 11);
    console.log(generatedID);
    return generatedID;
}

/** 
 * Write this.
 */
function activateTask() {
    db.collection("Students").doc(userID).update({
        Student_Quest: true
    })
    .then(() => {
        console.log("Task successfully activated!");
        location.href = "./student-view-quest.html?taskid=" + currentTaskID;
    })
    .catch((error) => {
        console.error("Error activating task: ", error);
    });
}

/** 
 * Write this.
 */
function writeTask() {
    let taskID = pseudorandomID();
    // Write task to student's task collection
    db.collection("Students").doc(userID).collection("Tasks").doc(taskID).set({
        Task_Submitter: userName,
        Submitter_ID: userID,
        Task_ID: currentTaskID,
        Task_Approved: false,
        Task_Rejected: false,
        Task_Unread: false
    })
        .then(() => {
            console.log("Task successfully written!");
            activateTask();
        })
        .catch((error) => {
            console.error("Error writing task: ", error);
        });
}

/**
 * Write this.
 */
function onClickAccept() {
    writeTask();
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
    // Stops videos from playing once modals are closed */
    $('#videoViewer').on('hide.bs.modal', function () {
        $('.modal-body iframe').attr('src', '');
    });
});
