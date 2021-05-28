// JS for educator-create-class.js

var validInput = false;

/**
* Counts the characters input into a specified DOM element. Starts at a specified max limit and counts down to 0.
* @author Paul Wilkins
* @see https://www.sitepoint.com/community/t/javascript-form-elements-character-countdown-loop-through-form-elements/342603
* 
* @param {*} field - DOM element that characters are being counted in.
* @param {*} field2 - ID of the DOM element displaying the number of characters remaining.
* @param {*} maxlimit - Maximum number of characters allowed in "field."
* @returns - False if the character limit has been exceeded.
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
 * Once the user has finished entering their class details, deal with a submission 
 * click in the appropriate manner. Input values are saved to appropriately-named
 * variables which are fed into a checkInput function. If the input is deemed valid,
 * the addClass() function is called with the same variables as input parameters.
 */
function onClickSubmit() {
    let description = document.getElementById("class-description").value;
    let nickname = document.getElementById("class-nickname").value;
    checkInput(description, nickname);
    if (validInput) {
        // Add class to Firestore
        addClass(description, nickname);
    }
}

/**
* Ensures that the user has input both a class description and nickname. If either
* of these is missing, an error message is pushed to the DOM and the "Create Class"
* function cascade is halted.
* 
* @param description - String containing a description of the class to be created.
* @param nickname - String containing the nickname of the class to be created.
*/
function checkInput(description, nickname) {
    if (description == null || nickname == null || description === "" || nickname === "") {
        $("#feedback").html("Please enter a class description and nickname");
        $("#feedback").css({
            color: "red"
        });
        $("#feedback").show(0);
        $("#feedback").fadeOut(2500);
    } else {
        validInput = true;
    }
}

/**
 * Writes a class to Firestore using a (validated) description and nickname entered
 * by the user. Other class fields set are: Class_Owner (set to the current user's display name),
 * Owner_Email, Class_Points (initially set to 0), and Date_Created. Once the class has been
 * written, users are directed back to the educator homepage.
 * 
 * @param description - String containing a description of the class to be created.
 * @param nickname - String containing the nickname of the class to be created.
 */
function addClass(description, nickname) {
    db.collection("Classes").doc(nickname).set({
        Class_Description: description,
        Class_Nickname: nickname,
        Class_Owner: firebase.auth().currentUser.displayName,
        Owner_Email: firebase.auth().currentUser.email,
        Class_Points: 0,
        Date_Created: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            console.log("Class successfully written!");
            displayFeedback();
            setTimeout(function () {
                // Direct users back to the educator homepage
                location.href = "./educator-home.html";
            }, 1000);
        })
        .catch((error) => {
            console.error("Error adding class: ", error);
        });
}

/**
 * Pushes a success message to the DOM once the class has been written.
 */
function displayFeedback() {
    $("#feedback").html("Success! Please wait...");
    $("#feedback").css({
        color: "green"
    });
    $(feedback).show(0);
    $(feedback).fadeOut(1000);
}

/**
 * Prevents the page from jumping upwards when a user clicks on the "Submit" button. This way,
 * any feedback pushed to the DOM can be seen without quickly scrolling back down again.
 */
$("#card-button-container-1 a").click(function (event) {
    event.preventDefault();
});
