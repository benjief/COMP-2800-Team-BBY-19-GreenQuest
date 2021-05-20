// JS for index.html

/**
 * Write this.
 * 
 */
function getBitmoji() {
    let storageRef = storage.ref();
    folderRef = storageRef.child("/images/bitmojis");
    storageRef.child("/images/bitmojis/36.png").getDownloadURL()
        .then((url) => {
            bitmojiURL = url;
            $("#bitmoji").attr("src", bitmojiURL);
        })
        .catch((error) => {
            console.error("Error getting url: ", error);
        })
}

// Run function when document is ready 
$(document).ready(function () {
    getBitmoji();
});