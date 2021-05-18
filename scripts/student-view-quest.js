
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

// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
    // Stops videos from playing once modals are closed */
    $('#videoViewer').on('hide.bs.modal', function () {
        $('.modal-body iframe').attr('src', '');
    });
});
