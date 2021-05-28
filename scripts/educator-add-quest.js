// JS for educator-add-quest.js

var validInput = false;

/**
 * The MIT License (MIT)

 * Copyright (c) 2011-2021 Twitter, Inc.
 * Copyright (c) 2011-2021 The Bootstrap Authors

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. 
 * 
 * @author Bootstrap
 * @see https://getbootstrap.com/docs/5.0/components/popovers/
 */
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

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
 * Adds a quest to the "Quests" collection in Firestore with user-specified properties. Once a quest is
 * written, it will be added to the roster of quests doles out to students, a success message is displayed to the DOM, and
 * users are redirected back to the educator homepage.
 * 
 * @param {*} title - String containing the quest title (limited to 40 characters).
 * @param {*} description - String containing the quest description (limited to 200 characters).
 * @param {*} instructions - Valid URL string containing the link to a video, website or document 
 *                           that helps students complete the quest (limited to 100 characters).
 * @param {*} info - Valid URL string containing the link to a video, website or document that provides
 *                   some insight into why this quest is worth pursuing (i.e. how it benefits the planet).
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
            $("#feedback").html("Success! Please wait...");
            $("#feedback").css({
                color: "green"
            });
            $(feedback).show(0);
            $(feedback).fadeOut(1000);
            setTimeout(function () {
                // Redirect users back to the educator homepage
                location.href = "./educator-home.html";
            }, 1000);
        })
        .catch((error) => {
            console.error("Error adding quest: ", error);
        });
}

/**
 * Populates Bootstrap popover with information that helps educators fill out the "Instructions Link"
 * and "Info Link" inputs.
 */
function populateText() {
    $("#more-info").attr("data-bs-content", "Include <b>links</b> to videos, websites or "
        + "documents that tell students how to complete this quest and help them understand how "
        + "it will better our planet.");
}

/**
 * Displays negative feedback to the DOM if a user has made an error while populating the required fields.
 * Errors are classified as: 
 * (a) not filling out all fields (which are required), or
 * (b) not entering valid URLs in the "Instructions Link" and "Info Link" inputs.
 * 
 * @param {*} feedback - The appropriate feedback message for the input error that has been made.
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
 * Deals with a submission click in the appropriate manner. First, the title, description,
 * instructions, and info are pulled from their corresponding DOM inputs and stored in appropriately-
 * named variables. Then, input contents are sent to the CheckInput function. If all input contents are valid,
 * they are input into addQuest().
 */
function onClickSubmit() {
    let title = document.getElementById("quest-title").value;
    let description = document.getElementById("quest-description").value;
    let instructions = document.getElementById("quest-instructions").value;
    let info = document.getElementById("quest-info").value;
    checkInput(title, description, instructions, info);
    if (validInput) {
        // Add quest to Firestore
        addQuest(title, description, instructions, info);
    }
}

/**
 * User-entered input from the quest title, description, instructions, and info fields
 * are checked for validity. First, the function makes sure that none of the fields are empty. Next,
 * URL inputs are checked to make sure all of the required components are present. If either of these
 * two checks fails, an appropriate error message is displayed, and the "Write Quest" function cascade 
 * is halted.
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} instructions 
 * @param {*} info 
 */
function checkInput(title, description, instructions, info) {
    // Make sure all fields are populated
    if (title == null || description == null || instructions == null || info == null
        || title === "" || description === "" || instructions === "" || info === "") {
        showFeedback("Please provide inputs for every field");
        // Make sure links are valid URLs
    } else if (!(checkValidURL(instructions) && checkValidURL(info))) {
        showFeedback("Please provide valid links");
    }
    else {
        // Allows the "Write Quest" function cascade to continue
        validInput = true;
    }
}

/**
 * Checks whether or not a specified string is a valid URL string.
 * @author brasofilo
 * @see https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * 
 * @param {*} str - The string to be checked.
 * @returns - True if the string is a valid URL string, false otherwise.
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
 * Prevents the page from jumping upwards when a user clicks on the "Reject" button. This way,
 * any feedback pushed to the DOM can be seen without quickly scrolling back down again.
 */
$("#card-button-container-1 a").click(function (event) {
    event.preventDefault();
})
