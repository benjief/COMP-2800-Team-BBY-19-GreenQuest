// JS for educator-home.html

var userID;
var userEmail;

/**
 * Checks to see if a student has accidentally logged into the educator site. If they have, redirects them
 * to the homepage.
 */
function checkIfStudent(somebody) {
    db.collection("Students")
        .doc(somebody.uid)
        .get()
        .then(function (doc) {
            // Extract the user's ID (if they're indeed a student)
            userID = doc.id;
            userEmail = doc.data().Student_Email;
            if (userEmail) {
                window.location.assign("/index.html");
            }
        });
}

/**
 * Pulls the current user's ID and email from Firestore and assigns them to userID and userEmail, respecitvely. Once userID and
 * userEmail are assigned values, checkNumQuests() and checkNumClasses() continue the function cascade. Finally, the user's 
 * name is also pulled from Firestore and a personalized greeting is generated and displayed on the page header.
 */
function sayHello() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            checkIfStudent(somebody);
            db.collection("Educators")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    // Extract the user's ID, email and name
                    userID = doc.id;
                    userEmail = doc.data().Educator_Email;
                    checkNumQuests();
                    checkNumClasses();
                    var name = doc.data().Educator_Name.split(" ", 1);
                    if (name) {
                        $("#personalized-greeting-established-user").html("Welcome back, " + name);
                        // Display a generic message if no name is entered when signing up
                    } else {
                        $("#personalized-greeting-established-user").html("Welcome back, GreenQuest User!");
                    }
                });
        }
    });
}

/**
 * Searches the "Student_Quests" collection in Firestore for quests whose 
 * Quest_Approver_ID field match the current educator's ID. Then, if any of the 
 * returned quests (provided they exist in the first place) have a Quest_Status 
 * field of "submitted," enableApproveQuests() is called. Otherwise, nothing 
 * changes and the "Approve Quests" button remains inactive.
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
 * Searches the "Classes" collection in Firestore for classes whose Owner_Email
 * attribute matches the current educator's email. If the query returns any 
 * results, enableManageClasses() is called. Otherwise, nothing happends and
 * the "Manage Classes" button remains inactive.
 */
function checkNumClasses() {
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

/**
 * Changes the "Approve Quests" button from an inactive to an active state.
 */
function enableApproveQuests() {
    // $("#card-button-container-2").css({ backgroundColor: "#ff80ee" });
    $("#card-button-container-2").removeClass("inactive");
    $("#card-button-container-2 a").attr("href", "educator-approve-quest.html");
}

/**
 * Changes the "Manage Classes" button from an inactive to an active state.
 */
function enableManageClasses() {
    // $("#card-button-container-1").css({ backgroundColor: "#ff80ee" });
    $("#card-button-container-1").removeClass("inactive");
    $("#card-button-container-1 a").attr("href", "./educator-manage-classes.html");
}

/**
 * Calls sayHello() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    sayHello();
});
