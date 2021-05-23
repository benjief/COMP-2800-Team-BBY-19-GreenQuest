// JS for educator-add-quest.js

var validInput = false;

// Popover code (taken from https://getbootstrap.com/docs/5.0/components/popovers/)
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
})

/**
 * Implement a character limit counter.
 * Taken from https://www.sitepoint.com/community/t/javascript-form-elements-character-countdown-loop-through-form-elements/342603.
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
 * Write this.
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} instructions 
 * @param {*} info 
 */
function addQuest(title, description, instructions, info) {
    db.collection("Quests").add({
        title: title,
        description: description,
        instruction: instructions,
        moreInfo: info
    })
        .then(() => {
            console.log("Quest successfully written!");
            // Display success message and direct users back to the main page
            let feedback = document.getElementById("feedback");
            feedback.innerHTML = "Success! Please wait...";
            $(feedback).show(0);
            $(feedback).fadeOut(1000);
            setTimeout(function () {
                location.href = "./educator-home.html";
            }, 1000);
        })
        .catch((error) => {
            console.error("Error adding quest: ", error);
        });
}

function populateText() {
    $("#more-info").attr("data-bs-content", "Include <b>links</b> to videos, websites or "
        + "documents that tell students how to complete this quest and help them understand how "
        + "it will better our planet.");
}

/**
 * Write this.
 * Modified from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * 
 * @param {*} str 
 * @returns
 */
function checkValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

/**
 * Write this.
 * 
 * @param {*} feedback 
 */
function showFeedback(feedback) {
    $("#feedback").html(feedback);
    $("#feedback").css({
        color: "red"
    });
    $("#feedback").show(0);
    $("#feedback").fadeOut(2000);
}

/**
 * Make sure the user has input a class name.
 * 
 * @param nickname - String containing the name of the class to be created
 */
function checkInput(title, description, instructions, info) {
    if (title == null || description == null || instructions == null || info == null
        || title === "" || description === "" || instructions === "" || info === "") {
        showFeedback("Please provide inputs for every field");
    } else if (!(checkValidURL(instructions) && checkValidURL(info))) {
        showFeedback("Please provide valid links");
    }
    else {
        validInput = true;
    }
}

/**
 * Deal with submission click in the appropriate manner.
 */
function onClickSubmit() {
    let title = document.getElementById("quest-title").value;
    let description = document.getElementById("quest-description").value;
    let instructions = document.getElementById("quest-instructions").value;
    let info = document.getElementById("quest-info").value;
    checkInput(title, description, instructions, info);
    if (validInput == true) {
        // Add quest to Firestore
        addQuest(title, description, instructions, info);
    }
}