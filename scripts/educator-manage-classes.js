// JS for educator-manage-classes.js

// Create an empty list to house class names
var userClasses = [];

// Create a variable to store the current user's name
var currentUser = null;

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateclassList() {
    if (userClasses.length == 0) {
        let message = "<p class='message'>You haven't got any classes!</p>"
        $(".class-list").append(message);
        let backButtonContainer = "<div class='card-button-container'></div>";
        $(".class-list").append(backButtonContainer);
        let backButton = "<a class='button' id='back-button' onclick='onClickBack()'>Back</a>";
        $(".card-button-container").append(backButton);
        
    } else {
        for (var i = 0; i < userClasses.length; i++) {
            let classContainer = "<div class='class-container' id='class-container-" + i + "'></div>";
            $(".class-list").append(classContainer);
            let className = "<p class='class-name' id='class-name-" + i + "' + ' onclick='onSelectclass()'>" + userClasses[i] + "</p>";
            $("#class-container-" + i).append(className);
        }
    }
}

function listClasses() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Users")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.data().Name;
                    console.log(currentUser);
                    getClasses();
                });
        }
    });
}


/**
 * Reads class names from Firestore and puts them into an array.
 */
function getClasses() {
    db.collection("Classes")
        .where("Owner_Name", "==", currentUser)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userClasses.push(doc.data().id);
            });
            populateclassList();
        })
        .catch((error) => {
            console.log("Error getting classes: ", error);
        });
}

/**
 * Redirects users to a page where they can choose how to manage the selected class.
 */
function onSelectclass() {
    $(document).click(function (event) {
        let className = $(event.target).html();
        setTimeout(function () {
            location.href = "educator-manage-class.html?classname=" + className;
        }, 500);
    });
}

/**
 * Redirects users back to the the main page page.
 */
 function onClickBack() {
    setTimeout(function () {
            location.href = "educator-home.html?";

    }, 1000);
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    listClasses();
});
