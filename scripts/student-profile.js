// JS for student-profile.html

// Pull user ID from URL
const parsedUrl = new URL(window.location.href);
var profileID = parsedUrl.searchParams.get("userid");

var userID;

var profileName;
var profilePoints;
var profilePic;
var profileClass;

var bitmojiURL = null;
var twitterBitmoji = null;

var recentQuests = [];

/**
 * Gets the current student's ID and from Firestore.
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
 * Write this.
 */
function getProfileInfo() {
    db.collection("Students").doc(userID)
        .get()
        .then(function (doc) {
            profileName = doc.data().Student_Name;
            // Extract the student's first name
            profileName = doc.data().Student_Name.split(" ", 1);
            profilePoints = doc.data().Student_Points;
            profilePic = doc.data().Student_Profile_Pic;
            profileClass = doc.data().Student_Class;
            populateDOM();
            populateHeading();
            getBitmoji();
            if (userID == profileID) {
                let newProfilePicInput = "<input type='file' accept='image/*' id='upload-new-image-input'></input>";
                let label = "<label for='upload-new-image-input' id='upload-new-image-label'>Upload New Image</label>";
                $(".modal-footer").append(newProfilePicInput, label);
                activateSecondaryInput();
            }
            if (profilePic == null) {
                if (userID === profileID) {
                    activatePrimaryInput();
                }
                else {
                    getBitmoji();
                }
            } else {
                addImageToDOM(profilePic);
            }
        })
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
                    updateHead();
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
 * Write this.
 */
function populateDOM() {
    $("#profile-name").html(profileName);
    $("#profile-points").html(profilePoints);
    if (profileClass == null) {
        $("#profile-class").html("Not in a Class");
    } else {
        $("#profile-class").html(profileClass);
    }
    if (userID == profileID) {
        let twitterIcon = "<div class='st-custom-button' id='twitter-icon' data-network='twitter'></div>";
        let facebookIcon = "<div class='st-custom-button' id='facebook-icon' data-network='facebook'></div>";
        $(".social-media-container").append(twitterIcon, facebookIcon);
        window.__sharethis__.initialize();
    }
}

/**
 * Write this.
 */
function populateHeading() {
    $(".page-heading").html(profileName + "\'s Page");
}


/**
 * CITE - Write this.
 */
function activatePrimaryInput() {
    let label = "<label for='upload-image-input' id='upload-image-label'>Upload Image</label>";
    $("#profile-pic-container").append(label);
    const imageInput = document.getElementById("upload-image-input");
    imageInput.addEventListener('change', function (event) {
        storeImage(event.target.files[0]);
    });
}

/**
 * Write this.
 */


/**
 * Write this.
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
 * Write this.
 */
function getStorageRef(file) {
    let imageID = file.lastModified;
    let storageRef = storage.ref();
    storageRef = storageRef.child("images/profile-pics/" + imageID + ".jpg");
    return storageRef;
}

/**
 * Write this.
 */
function setUserProfilePicture(image) {
    // console.log(image.url);
    db.collection("Students").doc(userID).update({
        Student_Profile_Pic: image.url
    })
        .then(() => {
            addImageToDOM(image.url);
            profilePic = image.url;
            // console.log(profilePic)
        });
}

/**
 * Write this.
 */
function addImageToDOM(source) {
    $("#profile-pic").attr("src", source);
    $("#profile-pic").attr("role", "button");
    $("#profile-pic").attr("data-target", "modalCenter");
    $("#profile-pic").attr("data-bs-toggle", "modal");
    $("#profile-pic").attr("data-bs-target", "#imagePreview");
    $("#profile-pic").attr("onclick", "showPreview(this)");
    $("#upload-image-label").remove();
}

/**
 * Write this.
 * 
 * @param {*} element 
 */
function showPreview(element) {
    $(".modal-body").html("");
    setTimeout(() => {
        let previewURL = $(element).attr("src");
        $(".modal-title").html(profileName + "\'s Profile Pic");
        $(".modal-body").html("<img src ='" + previewURL + "'>");
    }, 1000);
}

/**
 * Write this.
 */
function activateSecondaryInput() {
    const newImageInput = document.getElementById("upload-new-image-input");
    newImageInput.addEventListener('change', function (event) {
        console.log(event.target.files);
        deleteOldImage(event.target.files[0]);
        $("#imagePreview").modal("hide");
    });
}

/**
 * Write this.
 */
function deleteOldImage(newImageFile) {
    console.log("function called");
    let storageRef = storage.ref();
    deleteRef = profilePic.replace("https://firebasestorage.googleapis.com/v0/b/greenquest-"
        + "5f80c.appspot.com/o/images%2Fprofile-pics%2F", "");
    deleteRef = deleteRef.substr(0, deleteRef.indexOf("?"));
    deleteRef = storageRef.child("images/profile-pics/" + deleteRef);
    console.log("deleting " + deleteRef + " from storage");
    setTimeout
    deleteRef.delete()
        .then(() => {
            console.log("Profile pic successfully removed from storage!");
            storeImage(newImageFile);
        })
        .catch((error) => {
            console.error("Error removing profile pic from storage: ", error);
        });
}

/**
 * Write this.
 */
function getRecentlyApprovedQuests() {
    console.log(profileID);
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
 * Write this.
 */
function checkRecentQuests() {
    if (recentQuests.length == 0) {
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
 * Write this - note that it was taken from your other project.
 * 
 * @param {*} store 
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
 * Write this.
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
    console.log(recentQuests[i].bitmoji);
    // $("#tweet-" + i).attr("data-image", "https://firebasestorage.googleapis.com/v0/b/greenquest-5f80c.appspot.com/o/images%2Fbitmojis%2F23.png?alt=media&token=f5439a0e-d17b-4371-8d0e-c6b4e47dca91");
    getBitmojiBackground();
}

/**
 * Write this.
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
 * Write this.
 */
function updateHead() {
    console.log(bitmojiURL);
    $("#twitter-description").attr("value", "I've earned " + profilePoints + " points saving "
        + "the planet with GreenQuest. Come and join me!");
    $("#twitter-image").attr("value", bitmojiURL);
    $("#facebook-description").attr("content", "I've earned " + profilePoints + " points saving "
        + "the planet with GreenQuest. Come and join me!");
    $("#facebook-image").attr("content", bitmojiURL);
}

// Run function when document is ready 
$(document).ready(function () {
    getCurrentStudent();
});


//Loading timer
function myFunction() {
    setTimeout(showPage, 1000);
}
function showPage() {
    document.getElementById("loader").style.display = "none";
}
myFunction();
