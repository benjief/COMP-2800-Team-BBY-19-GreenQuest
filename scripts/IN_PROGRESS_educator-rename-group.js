// JS for educator-rename-group.js

// Pull group name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var groupName = parsedUrl.searchParams.get("groupname");
$("#group-name").attr("placeholder", groupName);

var noInput = false;

/**
 * Implement a character limit counter.
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
 * Renames a group that already exists Firestore.
 * 
 * @param groupName - String containing the name of the group to be renamed
 */
function renameGroup(groupName) {
    db.collection("Groups").doc(groupName)
    .set({
        id: groupName
    })
        .then(() => {
            console.log("Group successfully renamed!");
        })
        .catch((error) => {
            console.error("Error renaming group: ", error);
        });
}

/**
 * Check if the user has input a group name.
 * 
 * @param newGroupName - String containing the name of the group to be created
 */
function checkInput(newGroupName) {
    if (newGroupName == null || newGroupName === "") {
        noInput = true;
    } else {
        noInput = false;
    }
}

/**
 * Deal with submission click in the appropriate manner.
 */
function onClickSubmit() {
    // Store group name in a variable
    console.log(document.getElementById("group-name").value);
    let newGroupName = document.getElementById("group-name").value;
    checkInput(newGroupName);

    // Rename group in Firestore
    renameGroup(groupName);
    // Display success message and direct users back to the manage group page
    let feedback = document.getElementById("feedback");
    if (!noInput) {
        feedback.innerHTML = "Group renamed to " + newGroupName + "! Please wait...";
    } else {
        feedback.innerHTML = "Group not renamed. Please wait...";
    }
    $(feedback).css({
        color: "green"
    });
    $(feedback).show(0);
    $(feedback).fadeOut(2500);
    setTimeout(function () {
        location.href = "educator-manage-group.html?groupname=" + newGroupName;
    }, 2300);
}
