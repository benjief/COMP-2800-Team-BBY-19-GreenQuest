// JS for educator-new-home.html

/**
 * Displays a modal with a nice welcome message. Then, reads the current user's name from 
 * Firestore and use it to create a personalized greeting, which is finally pushed to the DOM (page header). 
 */
function sayHello() {
    $("#welcomeMessage").modal("show");
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    // Extract the user's name (and ID)
                    console.log(somebody.uid);
                    var name = doc.data().Educator_Name.split(" ", 1);
                    if (name) {
                        $("#personalized-greeting-new-user").html("Welcome, " + name);
                        // Display a generic message if no name is entered when signing up
                    } else {
                        $("#personalized-greeting-new-user").html("Welcome, GreenQuest User!");
                    }
                });
        }
    });
}

/**
 * Calls sayHello() when the page is ready.
 */
$(document).ready(function () {
    sayHello();
});
