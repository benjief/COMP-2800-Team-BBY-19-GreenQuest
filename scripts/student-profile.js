// JS for student-profile.html

// Pull the ID of the student this profile belongs to from the URL query string
const parsedUrl = new URL(window.location.href);
var profileID = parsedUrl.searchParams.get("userid");

var userID;
var profileName;
var profilePoints;
var profilePic;
var profileClass;
var recentQuests = [];

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 1.5 seconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
function delayTimer() {
    setTimeout(removeSpinner, 1000);
}

/**
 * Sets the spinner's display to none.
 */
function removeSpinner() {
    document.getElementById("loader").style.display = "none";
}
// Run the delay timer 
delayTimer();

/**
 * Pulls the current user's ID from the "Students" collection in Firestore. 
 */
function getCurrentStudent() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students").doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    userID = doc.id;
                    getProfileInfo();
                    getRecentlyApprovedQuests();
                });
        }
    });
}

/**
 * Pulls the current student's profile information from the "Students" collection in Firebase. This 
 * information includes the student's (first) name, their current points, their profile picture (if
 * it exists), and their class name. If the user's ID is the same as the profile page's ID (these are not
 * always the same), elements are added to the page that allow the current user to upload a profile picture
 * (not just once, but as many times as they see fit). If the user has previously uploaded a profile picture,
 * it will be displayed on this page (for everyone who visits to see).
 */
function getProfileInfo() {
    db.collection("Students").doc(profileID)
        .get()
        .then(function (doc) {
            // Extract the student's first name
            profileName = doc.data().Student_Name.split(" ", 1);
            profilePoints = doc.data().Student_Points;
            profilePic = doc.data().Student_Profile_Pic;
            profileClass = doc.data().Student_Class;
            populateHeading();
            populateDOM();
            // If the user is visiting their OWN profile page, add image-uploading functionality to the DOM
            if (userID == profileID) {
                let newProfilePicInput = "<input type='file' accept='image/*' id='upload-new-image-input'></input>";
                let label = "<label for='upload-new-image-input' id='upload-new-image-label'>Upload New Image</label>";
                $(".modal-footer").append(newProfilePicInput, label);
                activateSecondaryInput();
            }
            /* If the user hasn't yet uploaded a profile picture, use a bitmoji placeholder and give them the
               option of uploading their own image */
            if (profilePic == null) {
                if (userID === profileID) {
                    activatePrimaryInput();
                    getBitmoji();
                }
                else {
                    getBitmoji();
                }
                // If the user has previously uploaded a profile picture, add it to the DOM
            } else {
                addImageToDOM(profilePic);
            }
        })
}

/**
 * Populates the page header with the name of the student that this profile belongs to.
 */
function populateHeading() {
    $(".page-heading").html(profileName + "\'s Page");
}

/**
 * Inserts the name, points and class name (if it exists) of the student this profile belongs to into the
 * DOM. If the current student is viewing their own page, Twitter and Facebook icons (with sharing functionality)
 * are also added in, just below the student's points display.
 * These custom buttons were taken from @author sharethis
 * @see https://sharethis.com/support/customization/how-to-set-custom-buttons/
 */
function populateDOM() {
    $("#profile-name").html(profileName);
    $("#profile-points").html(profilePoints);
    if (profileClass == null) {
        $("#profile-class").html("Not in a Class");
    } else {
        $("#profile-class").html(profileClass);
    }
    if (userID === profileID) {
        let socialMediaContainer = "<div class='social-media-container'></div>";
        $(".profile-info-container").append(socialMediaContainer);
        let twitterIcon = "<div class='st-custom-button' id='twitter-icon' data-network='twitter'></div>";
        let facebookIcon = "<div class='st-custom-button' id='facebook-icon' data-network='facebook'></div>";
        $(".social-media-container").append(twitterIcon, facebookIcon);
        window.__sharethis__.initialize();
    }
}


/**
 * Lists all of the bitmoji images we have in Cloud Storage, and then generates a random number to choose
 * one that will be displayed with the current quest.
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
                    let bitmojiURL = url;
                    if (profilePic == null) {
                        $("#profile-pic").attr("src", bitmojiURL);
                    }
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
 * Appends a label to the student's profile picture container that, when clicked on, allows them to
 * upload a profile picture that will be uploaded to Cloud Storage and associated with their account
 * until they change it.
 */
function activatePrimaryInput() {
    let label = "<label for='upload-image-input' id='upload-image-label'>Upload Image</label>";
    $(".profile-pic-container").append(label);
    const imageInput = document.getElementById("upload-image-input");
    imageInput.addEventListener('change', function (event) {
        storeImage(event.target.files[0]);
    });
}

/**
 * Uploads an image to Cloud Storage. Then, generates a download URL for it.
 * 
 * @param {*} image - The image to be uploaded.
 */
function storeImage(image) {
    storageRef = getStorageRef(image);
    storageRef.put(image)
        .then(function () {
            console.log('Profile pic uploaded to Cloud Storage!');
            storageRef.getDownloadURL()
                .then(function (url) {
                    image.url = url;
                    setUserProfilePicture(image);
                })
        })
}

/**
 * Generates a file ID and creates/returns a Cloud Storage reference using that ID. In this case,
 * storage references are specific to our Cloud Storage images/profile-pic folders.
 * 
 * @param {*} file - The file (image in this case) to be ID'd and referenced.
 * @returns - A Cloud Storage reference for the specified file.
 */
function getStorageRef(file) {
    let imageID = file.lastModified;
    let storageRef = storage.ref();
    // All of our images are stored as jpegs
    storageRef = storageRef.child("images/profile-pics/" + imageID + ".jpg");
    return storageRef;
}

/**
 * Sets the current user's profile picture to the specified image (which must have a download URL as
 * one of its properties - namely the 'url' property, here). The student doc's Student_Profile_Pic field
 * value in the Firestore "Students" collection is updated to the download URL of the most recently 
 * uploaded image.
 * 
 * @param {*} image - The image to be set as the user's profile picture.
 */
function setUserProfilePicture(image) {
    db.collection("Students").doc(userID).update({
        Student_Profile_Pic: image.url
    })
        .then(() => {
            addImageToDOM(image.url);
            profilePic = image.url;
        });
}

/**
 * Sets all of the fields required to display a profile picture on the student's page. In addition to
 * being displayed, the image is also set up to open up a Bootstrap modal when clicked on, which displays
 * a larger version of the image. Once a user uploads their first profile picture, the primary upload "button"
 * that allowed them to upload that image in the first place disappears (and is replaced elsewhere with functionality
 * allowing them to replace their profile picture through the modal display).
 * 
 * @param source - The image URL.
 */
function addImageToDOM(source) {
    $("#profile-pic").attr("src", source);
    $("#profile-pic").attr("role", "button");
    $("#profile-pic").attr("data-target", "modalCenter");
    $("#profile-pic").attr("data-bs-toggle", "modal");
    $("#profile-pic").attr("data-bs-target", "#imagePreview");
    $("#profile-pic").attr("onclick", "showPreview(this)");
    // Remove primary upload functionality
    $("#upload-image-label").remove();
}

/**
 * Opens up a Bootstrap modal that displays a larger version of the user's most recently uploaded profile
 * picture. This is triggered when the circular "thumbnail" profile picture displayed on the page is clicked on.
 * 
 * @param {*} element  - The DOM element being displayed in this modal (in this case, the user's 
 *                       uploaded profile picture).
 */
function showPreview(element) {
    $(".modal-body").html("");
    setTimeout(() => {
        // The preview URL is the same as the image source
        let previewURL = $(element).attr("src");
        $(".modal-title").html(profileName + "\'s Profile Pic");
        $(".modal-body").html("<img src ='" + previewURL + "'>");
    }, 1000);
}

/**
 * Adds functionality that allows users to upload a new profile picture from within the Bootstrap
 * preview modal (i.e. when users click on and enlarge their profile picture).
 */
function activateSecondaryInput() {
    const newImageInput = document.getElementById("upload-new-image-input");
    newImageInput.addEventListener('change', function (event) {
        // The previously-uploaded image is deleted
        deleteOldImage(event.target.files[0]);
        // The modal is closed when a user uploads a new image
        $("#imagePreview").modal("hide");
    });
}

/**
 * Deletes the user's previously-uploaded profile picture. This function chops up the download URL stored in
 * profilePic to create a deletion reference. This reference is then used to remove a user's old profile picture
 * from Cloud Storage.
 * 
 * @param {*} newImageFile - The new iamge file to be uploaded to the Cloud.
 */
function deleteOldImage(newImageFile) {
    let storageRef = storage.ref();
    deleteRef = profilePic.replace("https://firebasestorage.googleapis.com/v0/b/greenquest-"
        + "5f80c.appspot.com/o/images%2Fprofile-pics%2F", "");
    deleteRef = deleteRef.substr(0, deleteRef.indexOf("?"));
    deleteRef = storageRef.child("images/profile-pics/" + deleteRef);
    deleteRef.delete()
        .then(() => {
            console.log("Profile pic successfully removed from storage!");
            // Store the new image file in the Cloud once the old one has been deleted
            storeImage(newImageFile);
        })
        .catch((error) => {
            console.error("Error removing profile pic from storage: ", error);
        });
}

/**
 * Searches the "Student_Quests" collection in Firestore for documents with Quest_Participant_IDs fields (arrays)
 * that contain the profile page owner's userID (i.e. quests that this student was a participant in). Query results
 * (if they exist) are ordered by their submission date, with newer quests at the top of the pile. The Quest_Status
 * field of each document is then searched for a value of "approved" or "rejected" (not "active" or "submitted" - the
 * other possible values this field can take on). Finally, the quests that make it through all of these filters are 
 * converted to JSON objects with title, date, bitmoji, points, and status fields, and pushed to the recentQuests array.
 */
function getRecentlyApprovedQuests() {
    db.collection("Student_Quests")
        .where("Quest_Participant_IDs", "array-contains", profileID)
        .orderBy("Date_Processed", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().Quest_Status === "approved") {
                    let recentQuest = {
                        "title": doc.data().Quest_Title,
                        "date": doc.data().Date_Processed,
                        "bitmoji": doc.data().Quest_Bitmoji,
                        "points": doc.data().Quest_Points,
                        "status": doc.data().Quest_Status
                    };
                    recentQuests.push(recentQuest);
                }
            });
            checkRecentQuests();
        });
}

/**
 * If no recent quests are returned in the query above, a message is displayed letting all viewers of 
 * this page know that the profile owner hasn't yet had any quests approved. If the student is viewing
 * their own profile page, a message prompting them to speak to their teacher about being added to a 
 * class is displayed.
 */
function checkRecentQuests() {
    if (recentQuests.length == 0) {
        // If the user is viewing their own page, a different message is displayed
        if (userID === profileID) {
            var message = "<div class='message-container'><p class='message'>Make sure your "
                + "teacher has added you to their class so you can start saving the planet!</p></div>";
        } else {
            var message = "<div class='message-container'><p class='message'>" + profileName
                + " hasn't completed any quests yet!</p></div>";
        }
        $(".quest-list").append(message);
        $(".quest-list").css({
            display: "flex",
            justifyContent: "center",
            textAlign: "center"
        });
        $(".card-text").html("No Recent Activity");
    } else {
        getTimeElapsed();
    }
}

/**
 * Takes the date property of a quest object in processedQuests and and calculates how much time (in milliseconds, seconds, 
 * minutes, hours, days, or years) has passed since that time. This function looks incredibly long, but that's just because
 * there are so many darn conditionals to deal with.
 */
function getTimeElapsed() {
    console.log(recentQuests.length);
    console.log(recentQuests);
    for (var i = 0; i < recentQuests.length; i++) {
        // Get timestamp for quest submission (convert to a date object)
        var timeProcessed = recentQuests[i].date.toDate();
        // Create a new date to compare timestamp to
        var currentTime = new Date();
        // Calculate time difference between latest update and current time in milliseconds
        var timeDifference = currentTime.getTime() - timeProcessed.getTime();
        // Sets the time difference to 0 if it's negative (which happens upon updating a store's headcount for some reason)
        if (timeDifference < 0) {
            timeDifference = 0;
        }
        // Define variables to convert from milliseconds to other units of time
        var oneSecond = 1000;
        var oneMinute = 60 * oneSecond;
        var oneHour = 60 * oneMinute;
        var oneDay = 24 * oneHour;
        var oneYear = 365.25 * oneDay;
        var unitOfTime;
        // Get the correct unit of time to post
        if (timeDifference < oneSecond) {
            unitOfTime = "milliseconds";
        } else if (oneSecond <= timeDifference && timeDifference < oneMinute) {
            unitOfTime = "seconds";
            timeDifference /= oneSecond;
        } else if (oneMinute <= timeDifference && timeDifference < oneHour) {
            unitOfTime = "minutes";
            timeDifference /= oneMinute;
        } else if (oneHour <= timeDifference && timeDifference < oneDay) {
            unitOfTime = "hours";
            timeDifference /= oneHour;
        } else if (oneDay <= timeDifference && timeDifference < oneYear) {
            unitOfTime = "days";
            timeDifference /= oneDay;
        } else {
            unitOfTime = "years";
            timeDifference /= oneYear;
        }
        addRecentQuestsToDOM(i, Math.floor(timeDifference), unitOfTime);
    }
}

/**
 * Creates a "quest container" DOM element that houses the quest's bitmoji, its title and the time that has
 * passed since it was processed (i.e. how long ago it was approved or rejected). Quest containers are created 
 * for all quests in recentQuests, and the final result is a list of all the user's processed quests.
 * 
 * @param {*} i - The index of the quest in recentQuests, currently being dealt with.
 * @param {*} timeDifference - How many milliseconds, seconds, minutes, hours, days, or years 
 *                             (as an interger) have passed since this quest was approved or rejected (e.g. SIX hours ago).
 * @param {*} unitOfTime - The unit of time timeDifference is expressed in (e.g. six HOURS ago).
 */
function addRecentQuestsToDOM(i, timeDifference, unitOfTime) {
    let questContainer = "<div class='quest-container' id='quest-container-" + i + "'></div>";
    $(".quest-list").append(questContainer);
    let questTitle = "<p class='quest-title' id='quest-title-" + i + "'>" + recentQuests[i].title + "</p>";
    $("#quest-container-" + i).append(questTitle);
    let questPoints = "<p class='quest-points' id='quest-points-" + i + "'>" + recentQuests[i].points + " points</p>";
    $("#quest-container-" + i).append(questPoints);
    var elapsedTime = "<p class='quest-date' id='elapsed-time-" + i + "'>Completed " + timeDifference + " "
        + unitOfTime + " ago</p>";
    $("#quest-container-" + i).append(elapsedTime);
    let questBitmoji = "<img class='bitmoji' id='bitmoji-" + i + "' src='" + recentQuests[i].bitmoji + "'>";
    $("#quest-container-" + i).append(questBitmoji);
    getBitmojiBackground();
}

/**
 * Chooses a random background from five images. The "+ 3" appears here because of the way background
 * images were named/stored. Once a number is chosen, a background is assigned to the quest's bitmoji.
 */
function getBitmojiBackground() {
    for (var i = 0; i < recentQuests.length; i++) {
        let randomNum = Math.floor(Math.random() * 5 + 3);
        $("#bitmoji-" + i).css({
            background: "url('../img/background_pattern_" + randomNum + ".png')"
        });
    }
}

/**
 * Calls getCurrentStudent() and starts the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentStudent();
});
