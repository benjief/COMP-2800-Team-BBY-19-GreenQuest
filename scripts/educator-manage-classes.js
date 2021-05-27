// JS for educator-manage-classes.js

// Create an empty list to house class names
var userClasses = [];

// Create a variable to store the current user's name
var currentUser = null;

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateClassList() {
    if (userClasses.length == 0) {
        let message = "<div class='message-container'><img src='/img/slow_down.png'>"
            + "<p class='message'>Slow down - create a class if you want one to manage!</p></div>";
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
 * Write this
 */
function listClasses() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Educators")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.data().Educator_Name;
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
 * Redirects users to a page where they can choose how to manage the selected class.
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
 * Redirects users back to the the main page page.
 */
function onClickBack() {
    setTimeout(function () {
        location.href = "./educator-home.html?";
    }, 1000);
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    listClasses();
});

//Load Timer
function myFunction() {
    setTimeout(showPage, 1000);
  }
  
  function showPage() {
    document.getElementById("loader").style.display = "none";
  }
  myFunction();
