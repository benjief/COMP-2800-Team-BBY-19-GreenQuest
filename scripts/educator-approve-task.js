
// JS for educator-approve-task.js

// Pull class name and ID from URL
const parsedUrl = new URL(window.location.href);
var taskName = parsedUrl.searchParams.get("taskname");
var taskID = parsedUrl.searchParams.get("taskid");
$(".page-heading").html(taskName);

var userID;
var taskSubmitter = null;
var taskDescription = null;
var taskNotes = null;
var taskPoints = 0;
var taskApproved = false;

// Create an empty array to store URLs of images attached to this task
var imageURLs = [];

/* Get the current user's ID from Firestore. */
function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current user's ID
                    userID = doc.id;
                    pullTaskInfo();
                });
        }
    });
}

/**
 * Write this.
 */
function pullTaskInfo() {
    db.collection("Educators").doc(userID).collection("Tasks").doc(taskID)
        .get()
        .then((doc) => {
            taskSubmitter = doc.data().Task_Submitter;
            taskDescription = doc.data().Task_Description;
            taskNotes = doc.data().Task_Notes;
            imageURLs = doc.data().Task_Photos;
            pupulateDOM();
        })
        .catch((error) => {
            console.log("Error getting task: ", error);
        });
}

function populateDOM() {
    let taskSubmitter = "<p id='task-submitter'>" + taskSubmitter + "</p>";
    $("#task-submitter-container").append(taskSubmitter);
    let taskDescription = "<p id='task-description'>" + taskDescription + "</p>";
    $("#task-description-container").append(taskDescription);
    let taskNotes = "<p id='task-notes'>" + taskNotes + "</p>";
    $("#task-notes-container").append(taskNotes);
}

/**
 * Write this.
 * 
 * @param {*} element 
 */
function showPreview(element) {
    $(".modal-body").html("");
    setTimeout(() => {
        let previewName = null;
        let previewURL = null;
        // console.log(uploadedImageFiles);
        // console.log($(element).attr("id"));
        // console.log($(element).attr("id") == uploadedImageFiles[0].name);
        // console.log(uploadedImageFiles[0].tempURL);
        for (var i = 0; i < uploadedImageFiles.length; i++) {
            if (uploadedImageFiles[i].name == $(element).attr("id")) {
                previewName = uploadedImageFiles[i].name;
                previewURL = uploadedImageFiles[i].tempURL;
            }
        }
        if (previewName) {
            $(".modal-title").html(previewName);
            $(".modal-body").html("<img src='" + previewURL + "'>");
        } else {
            $(".modal-title").html("No preview available");
            $(".modal-body").html("Sorry, we couldn't generate a preview for you.");
        }
    }, 1000);
}


/**
 * Write this
 */
function removeImage(element) {
    let imageName = $(element).attr("id");
    imageName = imageName.replace("delete-", "");
    let index = null;
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        if (uploadedImageFiles[i].name === imageName) {
            index = i;
        }
    }
    if (index >= 0) {
        uploadedImageFiles.splice(index, 1);
    }
    addNamesToDOM();
}

/**
 * CITE and write
 */
function getStorageRef(file, temp) {
    let imageID = file.lastModified;
    // Create a storage reference
    let storageRef = storage.ref();
    if (!temp) {
        storageRef = storageRef.child("images/tasks/" + imageID + ".jpg");
    } else {
        storageRef = storageRef.child("images/temp/" + imageID + ".jpg");
    }
    return storageRef;
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
 * Write this
 */
function getEducatorID() {
    db.collection("Educators")
        .where("Educator_Name", "==", educatorName)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                educatorID = doc.id;
            })
        })
        .catch((error) => {
            console.log("Error getting educator ID: ", error);
        });
}

/**
 * Write this
 * 
 * @param {*} imageURLs 
 */
function addTaskToDB(imageURLs) {
    let taskID = pseudorandomID();
    // Write task to student's task collection
    db.collection("Students").doc(userID).collection("Tasks").doc(taskID).set({
        Task_Submitter: userName,
        Task_Description: "Test",
        Task_Photos: imageURLs,
        Task_Notes: $("#task-notes").prop("value")
    })
        .then(() => {
            console.log("Student task successfully written!");
        })
        .catch((error) => {
            console.error("Error adding student task: ", error);
        });
    // Write task to teacher's task collection
    db.collection("Educators").doc(educatorID).collection("Tasks").doc(taskID).set({
        Task_Submitter: userName,
        Task_Description: "Test",
        Task_Photos: imageURLs,
        Task_Notes: $("#task-notes").prop("value"),
        Task_Approved: false
    })
        .then(() => {
            console.log("Educator task successfully written!");
            $("#feedback").html("Success! Please wait...");
            $("#feedback").show(0);
            $("#feedback").fadeOut(2500);
            setTimeout(function () {
                location.href = "./student-home.html";
            }, 2300);
        })
        .catch((error) => {
            console.error("Error adding educator task: ", error);
        });
}

/**
 * Write this.
 * 
 */
function deleteTempImages() {
    let storageRef = storage.ref();
    deleteRef = storageRef.child("images/temp");
    deleteRef.listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {
                itemRef.delete();
            });
        })
        .catch((error) => {
            console.error("Error deleting temp images: ", error);
        });
}

/**
 * CITE and write this
 */
function onClickSubmit() {
    // Generate image URLs and add them to an array
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let storageRef = getStorageRef(uploadedImageFiles[i], false);
        console.log(storageRef);
        storageRef.put(uploadedImageFiles[i])
            .then(function () {
                console.log('Uploaded to Cloud storage');
                storageRef.getDownloadURL()
                    .then(function (url) {
                        console.log(url);
                        imageURLs.push(url);
                        console.log(imageURLs);
                        /* Once list of permanent URLs is complete, create task documents in the student's and 
                           their teacher's task collection (include array of image URLs as an attribute) */
                        if (i == (uploadedImageFiles.length)) {
                            addTaskToDB(imageURLs);
                        };
                    })
            });
        console.log(uploadedImageFiles[i]);
        // deleteTempImages(uploadedImageFiles[i]);
    }
    deleteTempImages();
}

/**
 * CITE and write this
 */
function onClickHome() {
    // for (var i = 0; i < uploadedImageFiles.length; i++) {
    //     deleteTempImages(uploadedImageFiles[i]);
    // }
    deleteTempImages();
    location.href = "./student-home.html";
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
});
