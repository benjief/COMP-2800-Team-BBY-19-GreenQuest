// JS for student-submit-quest.js

// Pull quest and user IDs from URL
const parsedUrl = new URL(window.location.href);
var questID = parsedUrl.searchParams.get("questid");
var dataToRetrieve = parsedUrl.searchParams.get("redirectflag");

const maxStudents = 4;
var maxStudentsReached = false;
var userNames = [];
var className;
var educatorName;
var questDescription;
var validInput = false;
var tempImagesDeleted = false;
var uploadedImageFiles = [];
var imageURLs = [];

/**
 * CITE - Implement a character limit counter.
 * Taken from https://www.sitepoint.com/community/t/javascript-form-elements-character-countdown-loop-through-form-elements/342603.
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
        let message = "<div class='text-container' id='message'><p id='no-images'>You haven't uploaded any "
            + "images</p><img src='/img/question_icon.png' tabindex='0' role='button' id='image-info' data-bs-toggle='popover' "
            + "data-bs-content='Add up to 3 images that prove youve completed this task. If you worked with friends, submit a "
            + "group shot and add them to your submission below. You'll all get points!' data-bs-container='body'>"
            + "</div>"
        if (uploadedImageFiles.length == maxImages) {
            $("#upload-image-input").attr("disabled", "");
        } else if (uploadedImageFiles.length == 0) {
            $(".uploaded-images").append(message);
        } else {
            $("#upload-image-input").removeAttr("disabled");
            if ($("#message")) {
                $("#message").remove();
            }
        }
    }
    // Popover code (taken from https://getbootstrap.com/docs/5.0/components/popovers/)
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
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
        addImageNamesToDOM();
    });
}

/**
 * Write this
 */
function resetImageDOM() {
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
function addImageNamesToDOM() {
    resetImageDOM();
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' id='" +
            uploadedImageFiles[i].name + "' data-bs-toggle='modal' data-bs-target='#imagePreview' onclick='showPreview(this)'>" +
            "Image " + (i + 1) + "</a><img src='/img/remove_icon.png' class='minus-icon-active' id='delete-image-" +
            uploadedImageFiles[i].name + "' onclick='removeImage(this)'></li>";
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
    addImageNamesToDOM();
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
function getQuestParticipants() {
    db.collection("Student_Quests").doc(questID)
        .get()
        .then(function (doc) {
            userIDs = doc.data().Quest_Participant_IDs;
            userNames = doc.data().Quest_Participants;
            console.log(userNames);
            checkNumUploaded();
            processImage();
            addSubmittersToDOM();
            if (!doc) {
                let message = "<div class='text-container'><p class='message'>You haven't been added to a class yet</p></div>"
                $(".uploaded-images").append(message);
                $("#card-button-container-1").remove();
                $("#upload-image-input").attr("disabled", "");
                $("#quest-notes").attr("disabled", "");
                $("#quest-notes").attr("placeholder", "Ask your teacher to add you to their class to start getting quests");
            }

        })
}

/**
 * Write this.
 */
function addSubmittersToDOM() {
    checkNumAdded();
    resetSubmitterDOM();
    for (var i = 0; i < userNames.length; i++) {
        if (i == 0) {
            let submitterName = "<li class='submitter-name'><p>" + userNames[i] + "</p>"
                + "<img src='/img/remove_icon_grey.png' class='minus-icon-inactive'></li>";
            $("#submitter-list").append(submitterName);
        } else {
            let submitterName = "<li class='submitter-name'><p>" + userNames[i] + "</p>"
                + "<img src='/img/remove_icon.png' class='minus-icon-active' id='submitter-" + i + "'></li>";
            $("#submitter-list").append(submitterName);
        }
    }
}

/**
 * Write this
 */
function resetSubmitterDOM() {
    var questSubmitters = document.getElementsByClassName('submitter-name');
    while (questSubmitters[0]) {
        questSubmitters[0].parentNode.removeChild(questSubmitters[0]);
    }
}


/**
 * Write this
 */
$(document.body).on("click", ".minus-icon-active", function (event) {
    // Extract index from event id
    let index = $(event.target).attr("id");
    console.log(index);
    // Extract index from event id - 
    // taken from https://www.geeksforgeeks.org/extract-a-number-from-a-string-using-javascript/#:~:text=The%20number%20from%20a%20string,(%5Cd%2B)%2F)
    index = parseInt(index.match(/(\d+)/));
    console.log(index);
    console.log(index == 1);
    // Remove student from quest
    userNames.splice(index, 1);
    console.log(userNames);
    userIDs.splice(index, 1);
    db.collection("Student_Quests").doc(questID).update({
        Quest_Participants: userNames,
        Quest_Participant_IDs: userIDs
    })
        .then(() => {
            console.log("Student successfully removed from quest!");
            addSubmittersToDOM();
        })
        .catch((error) => {
            console.error("Error removing student from quest: ", error);
        });
});

/**
 * Write this
 */
function updateStudentQuest() {
    db.collection("Students").doc(userIDs[0]).update({
        Student_Quest: null
    })
        .then(() => {
            console.log("Student quest succesfully updated!");
        })
        .catch((error) => {
            console.error("Error updating student quest: ", error);
        });
}

/**
 * Write this.
 * 
 * @param {*} imageURLs 
 */
function addQuestToDB(imageURLs) {
    let dateSubmitted = new Date();
    // Update quest status and add attributes required for approval and further retrieval
    db.collection("Student_Quests").doc(questID).update({
        Quest_Status: "submitted",
        Quest_Participants: userNames,
        Quest_Participant_IDs: userIDs,
        Quest_Images: imageURLs,
        Quest_Notes: $("#quest-notes").prop("value"),
        Date_Submitted: dateSubmitted
    })
        .then(() => {
            console.log("Quest successfully updated!");
            updateStudentQuest();
            $("#feedback").html("Success! Please wait...");
            $("#feedback").css({ color: "green" });
            $("#feedback").show(0);
            $("#feedback").fadeOut(1000);
            deleteTempImages("./student-home.html");
            sessionStorage.clear();
        })
        .catch((error) => {
            console.error("Error updating student quest: ", error);
        });
}

/**
 * Write this.
 * 
 * @param {*} link 
 */
function deleteTempImages(redirectLink) {
    let storageRef = storage.ref();
    deleteRef = storageRef.child("images/temp");
    deleteRef.listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {
                itemRef.delete();
            });
            tempImagesDeleted = true;
            if (redirectLink != null && redirectLink != "") {
                setTimeout(function () {
                    location.href = redirectLink;
                }, 1000);
            }
        })
        .catch((error) => {
            console.error("Error deleting temp images: ", error);
        });
}

/**
 * Make sure the user has attached either photos or a note to their submission.
 */
function checkInput() {
    console.log(uploadedImageFiles.length);
    if (($("#quest-notes").prop("value") == null || $("#quest-notes").prop("value") === "") && uploadedImageFiles.length == 0) {
        $("#feedback").html("Attach a photo or enter quest notes");
        $("#feedback").css({
            color: "red"
        });
        $("#feedback").show(0);
        $("#feedback").fadeOut(2000);
    } else {
        validInput = true;
    }
}

/**
 * Write this.
 */
function generateImageURLs() {
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
    }
}

/**
 * Write this.
 */
function deactivateAddFriends() {
    $("#add-friends").removeAttr("onclick");
    $("#add-friends").css({ color: "rgb(180, 180, 180)", textDecoration: "none" });
}

/**
 * Write this.
 */
function activateAddFriends() {
    $("#add-friends").attr("onclick", "onClickAddFriends()");
    $("#add-friends").css({ color: "black", textDecoration: "underline" });
}

/**
 * Write this.
 */
function checkNumAdded() {
    if (userNames.length == maxStudents) {
        maxStudentsReached = true;
        deactivateAddFriends();
    } else {
        if (maxStudentsReached) {
            maxStudentsReached = false;
            activateAddFriends();
        }
    }
}

/**
 * Write this.
 * Adapted from: https://stackoverflow.com/questions/47935571/how-to-keep-the-radio-button-remain-checked-after-the-refresh (sessionStorage code)
 * and https://www.youtube.com/watch?v=8K2ihr3NC40&ab_channel=dcode (FileReader-related code)
 */
function readImage(image, index) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        // console.log(reader.result);
        sessionStorage.setItem("uploaded-image-" + index, reader.result);
    });
    reader.readAsDataURL(image);
}

/**
 * Write this.
 * Adapted from: https://stackoverflow.com/questions/47935571/how-to-keep-the-radio-button-remain-checked-after-the-refresh (sessionStorage code)
 */
function onClickAddFriends() {
    if (uploadedImageFiles.length > 0) {
        sessionStorage.setItem("numImageFilesUploaded", uploadedImageFiles.length);
        for (var i = 0; i < uploadedImageFiles.length; i++) {
            readImage(uploadedImageFiles[i], i);
        }
    }
    if ($("#quest-notes").prop("value") != null && ($("#quest-notes").prop("value") != "")) {
        sessionStorage.setItem("previouslyInputNotes", $("#quest-notes").prop("value"));
    }
    console.log(sessionStorage);
    window.location.assign("./student-add-friends.html?questid=" + questID);
}

/**
 * CITE and write this
 */
function onClickSubmit() {
    checkInput();
    console.log(validInput);
    if (validInput) {
        if (uploadedImageFiles.length == 0) {
            addQuestToDB(imageURLs);
        } else {
            // Generate image URLs and add them to an array
            generateImageURLs();
        }
    }
}

/**
 * Write this.
 */
function onClickHome() {
    deleteTempImages("./student-home.html");
}

/**
 * Write this.
 * Taken from https://stackoverflow.com/questions/3252730/how-to-prevent-a-click-on-a-link-from-jumping-to-top-of-page
 */
 $("#card-button-container-1 a").click(function (event) {
    event.preventDefault();
})

$("a").click(function (event) {
    event.preventDefault();
})

/**
 * Write this.
 * Taken from https://stackoverflow.com/questions/22578530/failed-to-execute-atob-on-window
 */
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

/** 
 * Write this.
 */
function retrieveData() {
    if (dataToRetrieve) {
        var numImageFilesUploaded = parseInt(sessionStorage.getItem("numImageFilesUploaded"));
        if (numImageFilesUploaded) {
            console.log(sessionStorage);
            for (var i = 0; i < numImageFilesUploaded; i++) {
                let base64ImageString = sessionStorage.getItem("uploaded-image-" + i);
                // let imageType = base64ImageString.substring(5, base64ImageString.indexOf(";"));
                // console.log(imageType);
                // console.log(base64ImageString);
                let testFile = dataURLtoFile(base64ImageString, 'Image ' + (i + 1));
                console.log(testFile);
                uploadedImageFiles.push(testFile);
                storeTemporaryImage(testFile);
                // console.log(blobURL);
                // let imageFile = new File([blobURL], "image-" + i);
                // console.log(imageFile);
                // uploadedImageFiles.push(imageFile);
                // console.log(uploadedImageFiles);
                // addImageNamesToDOM();
            }
            addImageNamesToDOM();
        }
        var previouslyInputNotes = sessionStorage.getItem("previouslyInputNotes");
        if (previouslyInputNotes != null && previouslyInputNotes !== "") {
            $("#quest-notes").prop("value", previouslyInputNotes);
        }
    } else {
        sessionStorage.clear();
    }
}

/**
 * Write this.
 */
$(document).ready(function () {
    getQuestParticipants();
    retrieveData();
});