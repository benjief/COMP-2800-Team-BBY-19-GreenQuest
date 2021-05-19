// JS for logout

/* User will be logged out upon clicking on the "Log Out" button in the nav bar 
   As such, they will have to sign in again if they want to have access to the app's core features 
   https://stackoverflow.com/questions/42571618/how-to-make-a-user-sign-out-in-firebase*/
function logout() {
    firebase.auth().signOut().then(function() {
        console.log("Sign-out successful.")
      }).catch(function(error) {
        console.log("An error happened.")
     });
}