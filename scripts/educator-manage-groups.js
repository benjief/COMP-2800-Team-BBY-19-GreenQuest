// JS for educator-manage-groups.js

// Create an empty list to house group names
var userGroups = [];

// Create a variable to store the current user's name
var currentUser = null;

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateGroupList() {
    if (userGroups.length == 0) {
        let message = "<p class='message'>You haven't got any groups!</p>"
        $(".group-list").append(message);
    } else {
        for (var i = 0; i < userGroups.length; i++) {
            let groupContainer = "<div class='group-container' id='group-container-" + i + "'></div>";
            $(".group-list").append(groupContainer);
            let groupName = "<p class='group-name' id='group-name-" + i + "' + ' onclick='onSelectGroup()'>" + userGroups[i] + "</p>";
            $("#group-container-" + i).append(groupName);
        }
    }
}

function listGroups() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("Users")
                .doc(user.uid)
                // Read
                .get()
                .then(function (doc) {
                    currentUser = doc.data().Name;
                    console.log(currentUser);
                    getGroups();
                });
        }
    });
}


/**
 * Reads group names from Firestore and puts them into an array.
 */
function getGroups() {
    db.collection("Groups")
        .where("Owner_Name", "==", currentUser)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userGroups.push(doc.data().id);
            });
            populateGroupList();
        })
        .catch((error) => {
            console.log("Error getting groups: ", error);
        });
}

/**
 * Redirects users to a page where they can choose how to manage the selected group.
 */
function onSelectGroup() {
    $(document).click(function (event) {
        let groupName = $(event.target).html();
        setTimeout(function () {
            location.href = "educator-manage-group.html?groupname=" + groupName;
        }, 500);
    });
}

/**
 * Call functions when the page is ready .
 */
$(document).ready(function () {
    listGroups();
});
