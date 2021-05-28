// JS for logout function

/**
 * A user will be logged out upon clicking on the "Log Out" button in the nav bar 
 * As such, they will have to sign in again if they want to have access to the app's 
 * core features.
 */
function logout() {
    firebase.auth().signOut().then(function () {
        console.log("Logout successful.")
    }).catch(function (error) {
        console.log("An error occurred while logging you out: " + error);
    });
}
