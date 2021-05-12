// JS for student-submit-task.js

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