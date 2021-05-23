// JS for login.html

// Set up a user type variable to store the type of user signing up or logging in
var userType = "educator";

$("#educator-radio").click(function () {
    userType = "educator";
})

$("#student-radio").click(function () {
    userType = "student";
})

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Call the getUserType function
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write. 
            //------------------------------------------------------------------------------------------
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) { //if new user
                if (userType === "student") {
                    db.collection("Students").doc(user.uid).set({
                        Student_Name: user.displayName,
                        Student_Email: user.email,
                        Student_Class: null,
                        Student_Educator: null,
                        Student_Points: 0,
                        Student_Quest: false
                    })
                        .then(function () {
                            console.log("New student added to firestore");
                            // Re-direct to student-new-home.html after signup
                            window.location.assign(
                                "/html/student-home.html?firstvisit=true"
                            );
                        })
                        .catch(function (error) {
                            console.log("Error adding new student: " + error);
                        });
                } else {
                    db.collection("Educators").doc(user.uid).set({
                        Educator_Name: user.displayName,
                        Educator_Email: user.email,
                    })
                        .then(function () {
                            console.log("New educator added to firestore");
                            // Re-direct to educator-new-home.html after signup
                            window.location.assign(
                                "/html/educator-new-home.html"
                            );
                        })
                        .catch(function (error) {
                            console.log("Error adding new educator: " + error);
                        });
                }
            } else {
                if (userType === "educator") {
                    window.location.assign("/html/educator-home.html");
                } else if (userType === "student") {
                    window.location.assign("/html/student-home.html");
                }
            }
            return true;
        },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: "#",
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

/**
 * Write this. 
 * Taken from: https://stackoverflow.com/questions/47935571/how-to-keep-the-radio-button-remain-checked-after-the-refresh
 */
function keepSelection() {
    sessionStorage.setItem("selection", JSON.stringify({"studentRadio": "checked"}));
}

$(document).ready(function () {
    var selection = sessionStorage.getItem("selection");
    if (selection) {
        if (JSON.parse(selection).studentRadio == "checked") {
            $("#student-radio").attr("checked", "checked");
            $("#educator-radio").attr("checked", "");
        } 
    }

});