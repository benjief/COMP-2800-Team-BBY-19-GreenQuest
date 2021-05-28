// JS for educator-manage-classes.js

var userClasses = [];
var currentUser = null;

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 500 milliseconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
 function delayTimer() {
    setTimeout(removeSpinner, 1000);
}

/**
 * Sets the spinner's display to none.
 */
function removeSpinner() {
    document.getElementById("loader").style.display = "none";
}
// Run the delay timer 
delayTimer();

/**
 * Reads the current user's ID from Firestore, uses that value to assign their name to
 * currentUser, and calls getClasses().
 */
 function getCurrentUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.data().Educator_Name;
                    getClasses();
                });
        }
    });
}

/**
 * Searches the "Classes" collection in Firestore for documents that have a Class_Owner
 * field matching the current user's name. Each of these classes (provided they exist) is
 * pushed to the userClasses array before populateClassList() is called.
 */
 function getClasses() {
    db.collection("Classes")
        .where("Class_Owner", "==", currentUser)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userClasses.push(doc.id);
            });
            populateClassList();
        })
        .catch((error) => {
            console.log("Error getting classes: ", error);
        });
}

/**
 * Appends a list of class names (that the user "owns") to the DOM. If userClasses is empty (i.e. the user
 * hasn't created any classes), a message is pushed to the DOM prompting the user to create
 * a class. 
 */
function populateClassList() {
    if (userClasses.length == 0) {
        let message = "<div class='message-container'><img src='/img/slow_down.png'>"
            + "<p class='message'>Slow down - you've got to create a class before you can manage it!</p></div>";
        $(".class-list").append(message);
        $(".class-list").css({
            height: "300px",
            display: "flex",
            justifyContent: "center"
        });
    } else {
        for (var i = 0; i < userClasses.length; i++) {
            let classContainer = "<table class='class-container' id='class-container-" + i + "'></table>";
            $(".class-list").append(classContainer);
            let className = "<tr><td class='class-name' id='class-name-" + i + "' + ' onclick='onSelectClass()'>" + userClasses[i] + "</td></tr>";
            $("#class-container-" + i).append(className);
        }
    }
}

/**
 * Redirects users to the "Manage Class" page, where they can choose how they want to manage the
 * selected class. Note that className is passed to the redirect link to create a URL query string.
 */
function onSelectClass() {
    $(document).click(function (event) {
        let className = $(event.target).html();
        setTimeout(function () {
            location.href = "./educator-manage-class.html?classname=" + className;
        }, 500);
    });
}


/**
 * Calls getCurrentUser() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    getCurrentUser();
});
