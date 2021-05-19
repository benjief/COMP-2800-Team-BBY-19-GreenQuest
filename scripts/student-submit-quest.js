
// JS for student-submit-quest.js

// Pull quest and user IDs from URL
const parsedUrl = new URL(window.location.href);
var questID = parsedUrl.searchParams.get("questid");
var userID = parsedUrl.searchParams.get("userid");

var userName;
var className;
var educatorName;
var educatorID;
var questDescription;
var uniqueQuestID;

// Create empty arrays to store files added to this quest and their URLs
var uploadedImageFiles = [];
var imageURLs = [];

/**
 * CITE - Implement a character limit counter.
 * 
 * @param {*} field - DOM-element that characters are being counted in
 * @param {*} field2 - ID of the DOM-element displaying the number of characters remaining
 * @param {*} maxlimit - Maximum number of characters allowed in "field"
 * @returns - false if the character limit has been exceeded
 */
function charCounter(field, field2, maxlimit) {
    var countfield = document.getElementById(field2);
    if (field.value.length > maxlimit) {
        field.value = field.value.substring(0, maxlimit);
        return false;
    } else {
        countfield.value = maxlimit - field.value.length;
    }
}

/**
 * Write this
 */
function checkNumUploaded() {
    const maxImages = 3;
    if (className) {
        let message = "<div class='text-container'><p class='message'>You haven't uploaded any images</p></div>"
        if (uploadedImageFiles.length == maxImages) {
            $("#upload-image-input").attr("disabled", "");
        } else if (uploadedImageFiles.length == 0) {
            $(".uploaded-images").append(message);
        } else {
            $("#upload-image-input").removeAttr("disabled");
            if ($(".message")) {
                $(".message").remove();
            }
        }
    }
}
/**
 * Write this.
 */
function storeTemporaryImage(image) {
    $("#" + image.name).attr("data-target", "modalCenter");
    let storageRef = getStorageRef(image, true);
    storageRef.put(image)
        .then(function () {
            console.log('Uploaded to temp Cloud storage');
            storageRef.getDownloadURL()
                .then(function (url) {
                    console.log(url);
                    image.tempURL = url;
                })
        });
}

/**
 * CITE - Write this.
 */
function processImage() {
    const imageInput = document.getElementById("upload-image-input");
    imageInput.addEventListener('change', function (event) {
        console.log(event.target.files[0]);
        uploadedImageFiles.push(event.target.files[0]);
        storeTemporaryImage(event.target.files[0]);
        addNamesToDOM();
    });
}

/**
 * Write this
 */
function resetDOM() {
    var uploadedImages = document.getElementsByClassName('list-item');
    while (uploadedImages[0]) {
        uploadedImages[0].parentNode.removeChild(uploadedImages[0]);
    }
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
function addNamesToDOM() {
    resetDOM();
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' id='"
            + uploadedImageFiles[i].name + "' data-bs-toggle='modal' data-bs-target='#imagePreview' onclick='showPreview(this)'>"
            + uploadedImageFiles[i].name + "</a><img src='/img/remove_icon.png' class='remove-icon' id='delete-"
            + uploadedImageFiles[i].name + "' onclick='removeImage(this)'></li>";
        $(".uploaded-images").append(imageDOM);
    }
    checkNumUploaded();
    $("#upload-image-input").prop("value", null);
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
        storageRef = storageRef.child("images/quests/" + imageID + ".jpg");
    } else {
        storageRef = storageRef.child("images/temp/" + imageID + ".jpg");
    }
    return storageRef;
}

/* Get the current user's name, class name, educator name, and ID from Firestore. */
function getCurrentStudent() {
    db.collection("Students").doc(userID)
        .get()
        .then(function (doc) {
            // Extract the current student's class name
            userName = doc.data().Student_Name;
            className = doc.data().Student_Class;
            educatorName = doc.data().Student_Educator;
            if (className == null) {
                let message = "<div class='text-container'><p class='message'>You haven't been added to a class yet</p></div>"
                $(".uploaded-images").append(message);
                $("#card-button-container-1").remove();
                $("#upload-image-input").attr("disabled", "");
                $("#quest-notes").attr("disabled", "");
                $("#quest-notes").attr("placeholder", "Ask your teacher to add you to their class to start getting quests");
            }
            getQuestDescription();
            getUniqueQuestID();
            checkNumUploaded();
            getEducatorID();
            processImage();
        });
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
 * Write this.
 */
function getQuestDescription() {
    console.log(questID);
    db.collection("Quests").doc(questID)
        .get()
        .then(function (doc) {
            questDescription = doc.data().description;
            console.log("Quest description successfully retrieved");
        })
        .catch((error) => {
            console.error("Error retrieving quest description: ", error);
        });
}

/**
 * Write this.
 */
function getUniqueQuestID() {
    db.collection("Students").doc(userID).collection("Quests")
    .where("Quest_Status", "==", "active")
    .get()
    .then((querySnapshot) => {
        // There should only ever be one quest at a time
        querySnapshot.forEach((doc) => {
            uniqueQuestID = doc.id;
        })
    })
    .catch((error) => {
        console.log("Error getting unique quest ID: ", error);
    });
}


/**
 * Write this
 */
function updateQuestStatus() {
    db.collection("Students").doc(userID).update({
        Student_Quest: false
    })
        .then(() => {
            console.log("Student quest status succesfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student quest status: ", error);
        });
}

/**
 * Write this.
 * 
 * @param {*} imageURLs 
 */
function addQuestToDB(imageURLs) {
    // Update quest in student's quest collection
    db.collection("Students").doc(userID).collection("Quests").doc(uniqueQuestID).update({
        Quest_Status: "submitted"
    })
        .then(() => {
            console.log("Student quest successfully updated!");
            updateQuestStatus();
            // Write quest to teacher's quest collection
            db.collection("Educators").doc(educatorID).collection("Quests").doc(uniqueQuestID).set({
                Quest_Submitter: userName,
                Submitter_ID: userID,
                Quest_Description: questDescription,
                Quest_Photos: imageURLs,
                Quest_Notes: $("#quest-notes").prop("value"),
            })
                .then(() => {
                    console.log("Educator quest successfully written!");
                    $("#feedback").html("Success! Please wait...");
                    $("#feedback").show(0);
                    $("#feedback").fadeOut(2500);
                    setTimeout(function () {
                        location.href = "./student-home.html";
                    }, 2300);
                })
                .catch((error) => {
                    console.error("Error adding educator quest: ", error);
                });
        })
        .catch((error) => {
            console.error("Error updating student quest: ", error);
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
                        /* Once list of permanent URLs is complete, create quest documents in the student's and 
                           their teacher's quest collection (include array of image URLs as an attribute) */
                        if (i == (uploadedImageFiles.length)) {
                            addQuestToDB(imageURLs);
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
