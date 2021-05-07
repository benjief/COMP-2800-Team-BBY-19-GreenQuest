// JS for educator-create-group.js

var noInput = false;

/**
 * Implement a character limit counter
 * 
 * @param {*} field - DOM-element that characters are being counted in
 * @param {*} field2 - ID of the DOM-element displaying the number of characters remaining
 * @param {*} maxlimit - Maximum number of characters allowed in "field"
 * @returns - false if the character limit has been exceeded
 */
function charCounter(field, field2, maxlimit) {
    var countfield = document.getElementById(field2);
    if (field.value.length > maxlimit) {
        field.value = field.value.substring(0, maxlimit);
        return false;
    } else {
        countfield.value = maxlimit - field.value.length;
    }
}

/**
 * Write a group to Firestore.
 * 
 * @param groupName - String containing the name of the group to be created
 */
function addGroup(groupName) {
    db.collection("Groups").doc(groupName).set({
        id: groupName,
        Owner_Name: firebase.auth().currentUser.displayName,
        Owner_Email: firebase.auth().currentUser.email,
        Date_Created: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

/**
 * Make sure the user has input a group name
 * 
 * @param groupName - String containing the name of the group to be created
 */
function checkInput(groupName) {
    if (groupName == null || groupName === "") {
        noInput = true;
        $("#feedback").html("Please enter a group name");
        $("#feedback").css({
            color: "red"
        });
        $("#feedback").show(0);
        $("#feedback").fadeOut(2500);
    } else {
        noInput = false;
    }
}

/**
 * Deal with submission click in the appropriate manner
 */
function onClickSubmit() {
    // Store group name in a variable
    console.log(document.getElementById("group-name").value);
    let groupName = document.getElementById("group-name").value;
    checkInput(groupName);
    if (noInput == false) {
        // Add group to Firestore
        addGroup(groupName);
        // Display success message and direct users back to the main page
        document.getElementById("feedback").innerHTML = "Success! Please wait...";
        $(feedback).css({
            color: "green"
        });
        $(feedback).show(0);
        $(feedback).fadeOut(2500);
        setTimeout(function () {
            location.href = "#";
        }, 2300);
    }

}