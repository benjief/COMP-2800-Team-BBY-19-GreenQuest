// JS for educator-create-group.js

/**
 * Implement a character limit counter
 * 
 * @param {*} field - DOM-element that characters are being counted in
 * @param {*} field2 - ID of the DOM-element displaying the number of characters remaining
 * @param {*} maxlimit - maximum number of characters allowed in "field"
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
 * Deal with submission click in the appropriate manner
 */
function onClickSubmit() {
    // Grab comment
    console.log(document.getElementById("comment_box").value);
    var feedback = document.getElementById("feedback");
    checkSelection();
    if (!noStoreSelected) {
        checkRating();
    }
    // Add or modify a review if selections are valid
    if (!noStoreSelected && !noRating) {
        addReview(store);
        // Display success message and direct users back to the main page
        document.getElementById("feedback").innerHTML = "Thanks for your feedback!";
        $(feedback).css({
            color: "green"
        });
        $(feedback).show(0);
        $(feedback).fadeOut(2500);
        setTimeout(function () {
            location.href = "/web/member/main.html"
        }, 2300);
    }
}