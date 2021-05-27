// JS for educator-new-home.html

/**
 * Get the current user's name from Firestore and use it to create a personalized greeting. 
 */
function sayHello() {
    $("#welcomeMessage").modal("show");
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Educators")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the user's name (and ID)
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

// Run function when document is ready 
$(document).ready(function () {
    sayHello();
});
