// JS for index.html

// /**
//  * Pulls a bitmoji image from Cloud Storage and pushes it to our index page DOM.
//  */
// function getBitmoji() {
//     let storageRef = storage.ref();
//     folderRef = storageRef.child("/images/bitmojis");
//     storageRef.child("/images/bitmojis/36.png").getDownloadURL()
//         .then((url) => {
//             bitmojiURL = url;
//             $("#bitmoji").attr("src", bitmojiURL);
//         })
//         .catch((error) => {
//             console.error("Error getting url: ", error);
//         })
// }

// /**
//  * Calls getBitmoji() when the page is ready.
//  */
// $(document).ready(function () {
//     getBitmoji();
// });