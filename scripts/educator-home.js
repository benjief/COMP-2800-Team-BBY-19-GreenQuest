// JS for educator-home.html

var userID;
var userEmail;

/**
 * Get the current user's name from Firestore and use it to create a personalized greeting. 
 * Also assigns current user's ID to userID and their ID to userEmail.
 */
function sayHello() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the user's ID, email and name
                    userID = doc.id;
                    checkNumQuests();
                    userEmail = doc.data().Educator_Email;
                    checkNumClasses();
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

/**
 * Write this
 */
function checkNumQuests() {
    let counter = 0;
    console.log(userID);
    db.collection("Student_Quests")
        .where("Quest_Approver_ID", "==", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                if (doc.data().Quest_Status == "submitted") {
                    counter++;
                }
            })
            if (counter > 0) {
                enableApproveQuests();
            }
        })
        .catch((error) => {
            console.log("Error getting classes: ", error);
        });
}

/**
 * Write this 
 */
function checkNumClasses() {
    console.log(userEmail);
    db.collection("Classes")
        .where("Owner_Email", "==", userEmail)
        .get()
        .then((querySnapshot) => {
            let numClasses = querySnapshot.size;
            if (numClasses != 0) {
                enableManageClasses();
            }
        })
        .catch((error) => {
            console.log("Error getting classes: ", error);
        });
}

/** Write this. */
function enableApproveQuests() {
    // $("#card-button-container-2").css({ backgroundColor: "#ff80ee" });
    $("#card-button-container-2").removeClass("inactive");
    $("#card-button-container-2 a").attr("href", "educator-approve-quest.html");
}

/** Write this. */
function enableManageClasses() {
    // $("#card-button-container-1").css({ backgroundColor: "#ff80ee" });
    $("#card-button-container-1").removeClass("inactive");
    $("#card-button-container-1 a").attr("href", "./educator-manage-classes.html");
}

// Run function when document is ready 
$(document).ready(function () {
    sayHello();
});
