// JS for index.html

/**
 * Write this.
 * 
 */
function getBitmoji() {
    let storageRef = storage.ref();
    folderRef = storageRef.child("images/bitmojis");
    storageRef.child("images/bitmojis/3" + randomNum.toString() + ".png").getDownloadURL()
        .then((url) => {
            bitmojiURL = url;
            // bitmojiURL = imageRef.getDownloadURL();
            addInfoToDOM();
        })
        .catch((error) => {
            console.error("Error getting url: ", error);
        })
        .catch((error) => {
            console.error("Error getting number of bitmojis: ", error);
        });
}