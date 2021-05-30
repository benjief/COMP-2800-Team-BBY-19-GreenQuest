// JS for student-submit-quest.js

// Pull quest ID and redirect flag from URL query string
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
 * The MIT License (MIT)

 * Copyright (c) 2011-2021 Twitter, Inc.
 * Copyright (c) 2011-2021 The Bootstrap Authors

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. 
 * 
 * @author Bootstrap
 * @see https://getbootstrap.com/docs/5.0/components/popovers/
 */
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

/**
 * Searches the "Student_Quests" collection in Firestore for a document whose ID matches that
 * of the current quest ID (i.e. the quest the student is submitting). That document's 
 * Quest_Participant_IDs and Quest_Participants fields are then stored in userIDs and userNames, 
 * respectively. If a quest document does not exist, messages letting the user know what has gone wrong and 
 * prompting them to speak to their teacher are displayed.
 */
function getQuestParticipants() {
    db.collection("Student_Quests").doc(questID)
        .get()
        .then(function (doc) {
            userIDs = doc.data().Quest_Participant_IDs;
            userNames = doc.data().Quest_Participants;
            getClassName();
            addSubmittersToDOM();
            processImage();
            // Display messages if no quest document is retrieved
            if (!doc) {
                let message = "<div class='text-container'><p class='message'>You haven't got any active quests to submit!</p></div>"
                $(".uploaded-images").append(message);
                $("#card-button-container-1").remove();
                $("#upload-image-input").attr("disabled", "");
                $("#quest-notes").attr("disabled", "");
                $("#quest-notes").attr("placeholder", "Try going back to the homepage. If you haven't been added to a class yet, talk to your teacher!");
            }

        })
}

/**
 * Pulls the submitting student's class name from the "Students" collection in Firestore.
 */
function getClassName() {
    db.collection("Students").doc(userIDs[0])
        .get()
        .then(function (doc) {
            className = doc.data().Student_Class;
            checkNumUploaded();
        })
}

/**
 * If a user hasn't attached any images to the quest they're submitting, a message is displayed along with a question icon
 * that displays a popover if clicked on (helping users understand the purpose of uploaded images in this context). An input
 * is also added to the page, which allows users to upload up to three images. If three images have been uploaded, this input
 * becomes inactive (although users can choose to discard already-uploaded images, in which case the input is reactivated).
 */
function checkNumUploaded() {
    const maxImages = 3;
    console.log(uploadedImageFiles.length);        // If 1 or 2 images have been uploaded, the image upload button is enabled and the message removed
    console.log(className);
    if (className) {
        // If 3 images are uploaded, the image upload button is disabled
        if (uploadedImageFiles.length == maxImages) {
            $("#upload-image-input").attr("disabled", "");
            // If 1 or 2 images have been uploaded, the image upload button is enabled and the message removed
        } else if (uploadedImageFiles.length != 0) {
            $("#upload-image-input").removeAttr("disabled");
            if ($("#message")) {
                $("#message").remove();
            }
        }
    }
}

/**
 * Adds an event listener to the image input button. When an image is uploaded, the file is pushed to
 * the uploadedImageFiles array.
 */
function processImage() {
    const imageInput = document.getElementById("upload-image-input");
    imageInput.addEventListener('change', function (event) {
        uploadedImageFiles.push(event.target.files[0]);
        storeTemporaryImage(event.target.files[0]);
        addImageNamesToDOM();
    });
}


/**
 * Images uploaded by users are stored in the Cloud temporarily (in a special folder) so that they can be previewed.
 * Here, stored image files are assigned a tempURL attribute that allows them to be viewed from the DOM.
 * 
 * @param image - The image to be stored temporarily on the Cloud
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
 * Deletes all of the image names posted to the DOM (acts as a sort of refresh function, so that the list of
 * uploaded images always stays in the right order, and deleted images are removed from the DOM).
 */
function resetImageDOM() {
    var uploadedImages = document.getElementsByClassName('list-item');
    while (uploadedImages[0]) {
        uploadedImages[0].parentNode.removeChild(uploadedImages[0]);
    }
}

/**
 * Opens up a Bootstrap modal that displays a larger version of the DOM element in question. This is triggered when an uploaded image
 * name (anchor) in the DOM is clicked on.
 * 
 * @param {*} element  - The DOM element being displayed in this modal (in this case, one of the user's 
 *                       attached images).
 */
function showPreview(element) {
    // Clear any content that may still be populating the modal
    $(".modal-body").html("");
    /* A timeout is set because without it, images rarely display properly. This likely has something 
       to do with a delay in information fetching */
    setTimeout(() => {
        let previewName = null;
        let previewURL = null;
        for (var i = 0; i < uploadedImageFiles.length; i++) {
            // The image name and URL are pulled from the anchor element's ID (strategically-generated)
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
 * Uploaded images' names are pushed to the DOM as anchor elements with "-" icons next to them,
 * which allow users to delete images if they no longer wish to submit them with this quest.
 */
function addImageNamesToDOM() {
    // Reset the list of images every time an image is deleted or a new image is uploaded
    resetImageDOM();
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        let imageDOM = "<li class='list-item'><a class='uploaded-image' id='" +
            uploadedImageFiles[i].name + "' data-bs-toggle='modal' data-bs-target='#imagePreview' onclick='showPreview(this)'>" +
            "Image " + (i + 1) + "</a><img src='/img/remove_icon.png' class='minus-icon-active' id='delete-image-" +
            uploadedImageFiles[i].name + "' onclick='removeImage(this)'></li>";
        $(".uploaded-images").append(imageDOM);
    }
    // Check the number of uploaded images every time an image is deleted or a new image is uploaded
    checkNumUploaded();
    $("#upload-image-input").prop("value", null);
}

/**
 * When a user clicks on the "-" icon beside each image name, the image is removed from the uploadedImageFiles
 * array and the DOM is refreshed so that the "deleted" image is no longer listed.
 
* @param - The DOM element clicked on (in this case, a "-" icon that corresponds to a listed image)
*/
function removeImage(element) {
    let imageName = $(element).attr("id");
    // A bit of crafty ID-generation above allows us to do this
    imageName = imageName.replace("delete-", "");
    let index = null;
    for (var i = 0; i < uploadedImageFiles.length; i++) {
        if (uploadedImageFiles[i].name === imageName) {
            index = i;
        }
    }
    if (index >= 0) {
        // Remove the image to be deleted from the uploaded images array
        uploadedImageFiles.splice(index, 1);
    }
    // Repopulate the DOM with the updated array of uploaded images
    addImageNamesToDOM();
}

/**
 * Generates and returns a storage reference for a file (an image in this case).
 * 
 * @param {*} file - The image to be uploaded to the Cloud.
 * @param {*} temp - true or false - dictates whether or not the storage reference returned
 *                   is for temporary (true) or semi-permanent (false) storage.
 * @returns - A Firebase storage reference for the image to be stored.
 */
function getStorageRef(file, temp) {
    let imageID = file.lastModified;
    // Create a storage reference
    let storageRef = storage.ref();
    if (!temp) {
        // If the image is meant to be stored semi-permanently, the image is stored in the "quests" folder
        storageRef = storageRef.child("images/quests/" + imageID + ".jpg");
    } else {
        // Otherwise, the image is stored in the "temp" folder
        storageRef = storageRef.child("images/temp/" + imageID + ".jpg");
    }
    return storageRef;
}

/**
 * Populates the DOM with a list of quest submitters. Each submitter has a "-" icon across from
 * their name that allows the user to remove them from the quest (although the primary submitter
 * cannot remove themselves, as they are the one submitting the quest).
 */
function addSubmittersToDOM() {
    checkNumAdded();
    resetSubmitterDOM();
    for (var i = 0; i < userNames.length; i++) {
        if (i == 0) {
            /* The primary submitter (i.e. the current student) should not be able to remove themselves
               from the submitter list */
            let submitterName = "<li class='submitter-name'><p>" + userNames[i] + "</p>"
                + "<img src='/img/remove_icon_grey.png' class='minus-icon-inactive'></li>";
            $("#submitter-list").append(submitterName);
        } else {
            // Other submitters, however, can be removed with the click of a button
            let submitterName = "<li class='submitter-name'><p>" + userNames[i] + "</p>"
                + "<img src='/img/remove_icon.png' class='minus-icon-active' id='submitter-" + i + "'></li>";
            $("#submitter-list").append(submitterName);
        }
    }
}

/**
 * Deletes the list of submitters from the DOM (again, acts as a sort of reset function so that submitters are
 * always listed in order and removed submitters get purged).
 */
function resetSubmitterDOM() {
    var questSubmitters = document.getElementsByClassName('submitter-name');
    while (questSubmitters[0]) {
        questSubmitters[0].parentNode.removeChild(questSubmitters[0]);
    }
}


/**
 * When an active "-" icon next to a submitter name is clicked, that submitter is removed
 * from the quest's array's of user names and IDs (userNames and userIDs). Then, the quest 
 * document itself is updated in Firestore.
 */
$(document.body).on("click", ".minus-icon-active", function (event) {
    // Extract the participant index from the event id
    let index = $(event.target).attr("id");
    index = parseInt(index.match(/(\d+)/));
    // Remove student from quest arrays
    userNames.splice(index, 1);
    userIDs.splice(index, 1);
    // Update the quest document in Firestore
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
 * When a student is removed from this quest's list of participants, their student doc
 * in Firestore's "Students" collection is updated so that its Student_Quest field is
 * set to null (since they are no longer an active participant in this, or any, quest).
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
 * Updates the current quest document in Firestore's "Student_Quests" collection. The quest's
 * Quest_Status field is updated to "submitted," its Quest_Participants, Quest_Participant_IDs, 
 * Quest_Images, and Quest_Notes fields are updated to reflect any changes made on this page, and
 * a Date_Submitted field is added. Once a quest has been updated, a success message is displayed
 * on the page, session storage is cleared, temporary images are deleted from Cloud Storage, and the
 * user is redirected to the student homepage.
 * 
 * @param {*} imageURLs - Download URLs of any images attached and submitted by the current user.
 */
function updateQuestInDB(imageURLs) {
    // Update quest status and add attributes required for approval and further retrieval
    db.collection("Student_Quests").doc(questID).update({
        Quest_Status: "submitted",
        Quest_Participants: userNames,
        Quest_Participant_IDs: userIDs,
        // Uploaded image URLs are added
        Quest_Images: imageURLs,
        // Quest notes input by the primary quest submitter are recorded
        Quest_Notes: $("#quest-notes").prop("value"),
        Date_Submitted: new Date()
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
 * Any time a user clicks on the "Submit" button, the temp image folder is deleted from Cloud Storage.
 * 
 * @param {*} redirectLink - The link that the user should be redirected to once temporary images have been deleted.
 */
function deleteTempImages(redirectLink) {
    let storageRef = storage.ref();
    // The deletion reference corresponds to the entire temp folder in Cloud Storage
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
 * Ensures that the user has attached either at least one photo, or a note to their submission. If either of these
 * requirements isn't met, an error message is displayed on the page.
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
 * Generates download URLs for the uploaded images attached to the user's submission.
 */
function generateImageURLs(image) {
    let storageRef = getStorageRef(image, false);
    console.log(storageRef);
    storageRef.put(image)
        .then(function () {
            console.log('Uploaded to Cloud storage');
            storageRef.getDownloadURL()
                .then(function (url) {
                    console.log(url);
                    imageURLs.push(url);
                    console.log(imageURLs.length);
                    if (imageURLs.length == uploadedImageFiles.length) {
                        updateQuestInDB(imageURLs);
                    }
                })
        });
}

/**
 * Deactivates the "Add Friends" link in the DOM.
 */
function deactivateAddFriends() {
    $("#add-friends").removeAttr("onclick");
    $("#add-friends").css({ color: "rgb(180, 180, 180)", textDecoration: "none" });
}

/**
 * Activates the "Add Friends" link in the DOM.
 */
function activateAddFriends() {
    $("#add-friends").attr("onclick", "onClickAddFriends()");
    $("#add-friends").css({ color: "black", textDecoration: "underline" });
}

/**
 * Once the maximum number of participants (3 on top of the primary submitter) has been reached, the "Add Friends"
 * link is rendered inactive. If participants are subsequently removed from the quest submission, the link is reactivated.
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
 * Creates a Base64 data URL string for an image. This string is then stored in session storage so that it can
 * be retrieved upon re-entering this page after a user adds participants to this quest.
 * This code was adapted from @author dcode's video on YouTube
 * @see https://www.youtube.com/watch?v=8K2ihr3NC40&ab_channel=dcode 
 * 
 * @param {*} image - The image to be converted into a data URL string.
 * @param {*} index - The index of the image in the uploadedImageFiles array.
 */
function readImage(image, index) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        // Store the result (Base64 data URL string) in session storage for later retrieval
        sessionStorage.setItem("uploaded-image-" + index, reader.result);
    });
    reader.readAsDataURL(image);
}

/**
 * When a user clicks on the "Add Friends" link, any images uploaded or notes input on this page
 * are stored in session storage, so that they can be retrieved upon re-entering this page after
 * adding participants to this quest. Once data has been stored, the user is redirected to the 
 * "Add Friends" page, along with this quest's ID in a URL query string.
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
    window.location.assign("./student-add-friends.html?questid=" + questID);
}

/**
 * When the user clicks on the "Submit" button, their input (i.e. photos uploaded and quest notes)
 * is checked, and if it's deemed valid, the quest is updated in Firestore and submitted for approval 
 * by the primary submitter's educator. It is only at this stage that any semi-permanent image download URLs
 * are generated.
 */
$(document.body).on("click", "#submit-button", function (event) {
    checkInput();
    if (validInput) {
        if (uploadedImageFiles.length == 0) {
            updateQuestInDB(imageURLs);
        } else {
            // Generate image URLs and add them to an array
            for (var i = 0; i < uploadedImageFiles.length; i++) {
                generateImageURLs(uploadedImageFiles[i]);
            }
        }
    }
});

/**
 * When users click on the "Home" button, the temporary images folder is deleted and they are redirected
 * to the student homepage.
 */
function onClickHome() {
    deleteTempImages("./student-home.html");
}

/**
 * Prevents the page from jumping upwards when a user clicks on the "Submit" button. This way,
 * any feedback pushed to the DOM can be seen without quickly scrolling back down again.
 */
$("#card-button-container-1 a").click(function (event) {
    event.preventDefault();
})

/**
 * Prevents the page from jumping upwards when a user clicks on the "Add Friends" link.
 */
$("#add-friends").click(function (event) {
    event.preventDefault();
})

/**
 * Converts a Base64 data URL string back into a file object.
 * @author cuixiping
 * @see https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
 * 
 * @param {*} dataurl - The data URL string to be converted back into a file object.
 * @param {*} filename - The desired name of the file object.
 * @returns - A file object with the specified filename.
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
 * Pulls images and notes from session store upon re-entry to this page from the "Add Friends" page.
 * Images are converted from Base64 data URL strings back into files before being placed back into the
 * uploadedImageFiles array (and pushed to the DOM), while previously-input notes are put back into their
 * original input container (also in the DOM). Images are also re-stored temporarily on the Cloud, so that 
 * the user can still preview them. Note that "dataToRetrieve" actually comes from a redirect flag put into
 * a URL query string when users leave the "Add Friends" page and are redirected back here.
 */
function retrieveData() {
    if (dataToRetrieve) {
        var numImageFilesUploaded = parseInt(sessionStorage.getItem("numImageFilesUploaded"));
        if (numImageFilesUploaded) {
            if (numImageFilesUploaded != 0) {
                $("#message").remove();
            }
            console.log(sessionStorage);
            for (var i = 0; i < numImageFilesUploaded; i++) {
                let base64ImageString = sessionStorage.getItem("uploaded-image-" + i);
                let imageFile = dataURLtoFile(base64ImageString, 'Image ' + (i + 1));
                console.log(imageFile);
                uploadedImageFiles.push(imageFile);
                storeTemporaryImage(imageFile);
            }
            // Put 
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

function populateText() {
    $("#image-info").attr("data-bs-content", "Add up to <b>3 images</b> that you've completed your quest. "
        + "If you worked with friends, submit a group shot and add them to your submission below. You'll " +
        "all get points!");
}

/**
 * Calls getQuestParticipants() and retrieveData() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    getQuestParticipants();
    retrieveData();
});
