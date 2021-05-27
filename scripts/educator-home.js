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
    console.log(userID);
    db.collection("Student_Quests")
        .where("Quest_Approver_ID", "==", userID)
        .get()
        .then((querySnapshot) => {
            let numClasses = querySnapshot.size;
            if (numClasses == 0) {
                disableApproveQuests();
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
            if (numClasses == 0) {
                disableManageClasses();
            }
        })
        .catch((error) => {
            console.log("Error getting classes: ", error);
        });
}

/** Write this. */
function disableApproveQuests() {
    $("#card-button-container-2").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-2").css({ transform: "none" });
    $("#card-button-container-2 a").removeAttr("href");
}

/** Write this. */
function disableManageClasses() {
    $("#card-button-container-1").css({ backgroundColor: "rgb(200, 200, 200)" });
    $("#card-button-container-1").css({ transform: "none" });
    $("#card-button-container-1 a").removeAttr("href");
}

// Run function when document is ready 
$(document).ready(function () {
    sayHello();
});

//Load Timer
//Taken from https://www.w3schools.com/howto/howto_css_loader.asp
function delayTimer() {
    setTimeout(removeSpinner, 700);
  }
  
  function removeSpinner() {
    document.getElementById("loader").style.display = "none";
  }
  delayTimer();