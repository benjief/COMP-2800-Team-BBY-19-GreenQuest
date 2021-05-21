// JS for educator-home.html

var questIDs = [];
var currentUser = null;


/**
 * Get the current user's name from Firestore and use it to create a personalized greeting. 
 * Also assigns current user's ID to currentUser.
 */
function sayHello() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the user's name (and ID)
                    currentUser = doc.id;
                    checkQuests();
                    var name = doc.data().Educator_Name.split(" ", 1);
                    if (name) {
                        $("#personalized-greeting-new-user").html("Welcome, " + name);
                        $("#personalized-greeting-established-user").html("Welcome back, " + name);
                        // Display a generic message if no name is entered when signing up
                    } else {
                        $("#personalized-greeting-new-user").html("Welcome, GreenQuest User!");
                        $("#personalized-greeting-established-user").html("Welcome back, GreenQuest User!");
                    }
                });
        }
    });
}

<<<<<<< HEAD
/**
 * Write this - CITE https://stackoverflow.com/questions/47997748/is-possible-to-check-if-a-collection-or-sub-collection-exists.
 */
function checkQuests() {
    console.log(currentUser);
    db.collection("Educators").doc(currentUser).collection("Quests")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                questIDs.push(doc.id);
            })
            console.log(questIDs.length);
            if (questIDs.length == 0) {
                disableApproveQuests();
            }
        })
        .catch((error) => {
            console.log("Error getting quest IDs: ", error);
        });
}

/** Write this. */
function disableApproveQuests() {
    console.log("hello");
    $("#card-button-container-2").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-2 a").removeAttr("href");
}

// Run function when document is ready 
$(document).ready(function () {
    sayHello();
=======
// WORK IN PROGRESS
function markQuest() {
    if (questIDs.length == 0) {
        console.log("no quest to mark " + questIDs);
        let message = "<div class='text-container'><p class='message'>You haven't got any quests to approve.</p></div>"
        $("#feedback").html(message);
        $("#feedback").show(0);
        $("#feedback").fadeOut(2000);
    } else {
        location.href = "./educator-approve-quest.html";
    }
}

/**
 * Write this
 */
 function listQuests() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.id;
                    console.log(currentUser);
                    getQuests();
                });
        }
    });
}

/**
 * Reads quest IDs from Firestore and puts them into an array.
 */
 function getQuests() {
    db.collection("Educators").doc(currentUser).collection("Quests")
        .orderBy("Date_Submitted", "asc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                questIDs.push(doc.id);
            });
        })
        .catch((error) => {
            console.log("Error getting quests: ", error);
        });
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    listQuests();
>>>>>>> 932c05f6b5a52b67d6005b40cfafffb7f8c6ac05
});