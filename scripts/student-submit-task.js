// JS for student-submit-task.js

/**
 * CITE - Implement a character limit counter.
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
 * CITE - Displays a picture uploaded by the user in the DOM and resets the "Choose File" input button.
 */
function processUploadedPicture(){
    const fileInput = document.getElementById("mypic-input");   // pointer #1
    const image = document.getElementById("mypic-goes-here");   // pointer #2
    fileInput.addEventListener('change', function(e){        //event listener
        var blob = URL.createObjectURL(e.target.files[0]);
        image.src = blob;    //change DOM image
    })
}
showUploadedPicture();

/**
 * 
 */
function onClickSubmit() {

}