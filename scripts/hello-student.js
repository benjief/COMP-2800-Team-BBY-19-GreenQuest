// JS for personalized greetings (student homepage)

// Pull 'firstvisit' tag from URL and use it to choose the correct message to display
const parsedUrl = new URL(window.location.href);
var firstVisit = parsedUrl.searchParams.get("firstvisit");

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
                        if (firstVisit) {
                            $("#personalized-greeting-new-user").html( "Welcome, " + name);
                        } else {
                            $("#personalized-greeting-established-user").html( "Welcome back, " + name);
                        }
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
