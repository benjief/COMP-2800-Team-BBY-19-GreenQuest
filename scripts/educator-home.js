var questIDs = [];
var currentUser = null;

// JS for personalized greetings (educator homepage)

/* Get the current user's name from Firestore and use it to create personalized greetings
   on educator-(new-)home.html */
function sayHello() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the first name of the user
                    console.log(somebody.uid);
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
sayHello();


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
});