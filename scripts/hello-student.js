// JS for personalized greetings (student homepage)



/* Get the current user's name from Firestore and use it to create personalized greetings
   on student-(new-)home.html */
   function sayHello() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the first name of the user
                    var name = doc.data().Student_Name.split(" ", 1);
                    if (name) {
                        $("#personalized-greeting-new-user").html( "Welcome, " + name);
                        $("#personalized-greeting-established-user").html( "Welcome back, " + name);
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
