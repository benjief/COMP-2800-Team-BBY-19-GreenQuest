// JS for login.html

// Set up a user type variable to store the type of user signing up or logging in
var userType = "educator";

var educatorKey = 123456;
var validKey = false;

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
                        Student_Quest: null,
                        Student_Profile_Pic: null,
                        User_Type: "student"
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
                        User_Type: "educator"
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
    // Get rid of page reload when a user signs in with email
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
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
 */
function hideKeyElements() {
    $("#input-container").css({ display: "none" });
    $("#feedback-placeholder").css({ display: "none" });
    $("#card-button-container-1").css({ display: "none" });
    $("#firebaseui-auth-container").css({ display: "" });
}

/**
 * Write this.
 */
function showKeyElements() {
    $("#input-container").css({ display: "" });
    $("#feedback-placeholder").css({ display: "" });
    $("#card-button-container-1").css({ display: "" });
    $("#firebaseui-auth-container").css({ display: "none" });
    var keyStatus = sessionStorage.getItem("key");
    if (keyStatus) {
        if (JSON.parse(key).status == "valid") {
            hideKeyElements();
        }
    }
}

/**
 * Write this.
 */
function checkUserType() {
    var keyStatus = sessionStorage.getItem("key");
    console.log(keyStatus);
    if ($("#educator-radio").attr("checked") == "checked") {
        userType = "educator";
        if (validKey == false) {
            showKeyElements();
        } else {
            hideKeyElements();
        }
    } else {
        userType = "student";
        hideKeyElements();
    }
}

/**
 * Write this.
 * 
 * @param {*} key
 */
function checkInput(key) {
    if (key == null || parseInt(key) != educatorKey) {
        $("#feedback").html("Please enter a valid educator key");
        $("#feedback").css({
            color: "red"
        });
        $("#feedback").show(0);
        $("#feedback").fadeOut(2000);
    } else {
        validKey = true;
    }
}

/**
 * Deal with submission click in the appropriate manner.
 */
function onClickSubmit() {
    let key = document.getElementById("educator-validation").value;
    checkInput(key);
    console.log(key);
    console.log(validKey);
    if (validKey == true) {
        // Display success message and direct users back to the main page
        $("#feedback").html("Success! Please wait...");
        $("#feedback").css({
            color: "green"
        });
        $(feedback).show(0);
        $(feedback).fadeOut(1000);
        setTimeout(function () {
            sessionStorage.setItem("keyStatus", JSON.stringify({ "key": "valid" }));
            $("#input-container").css({ display: "none" });
            $("#feedback-placeholder").css({ display: "none" });
            $("#card-button-container-1").css({ display: "none" });
            $("#firebaseui-auth-container").css({ display: "" });
        }, 1000);
    }
}

/**
 * Write this. 
 * Taken from: https://stackoverflow.com/questions/47935571/how-to-keep-the-radio-button-remain-checked-after-the-refresh
 */
function educatorSelected() {
    userType = "educator";
    sessionStorage.setItem("selection", JSON.stringify({ "studentRadio": "unchecked" }));
    showKeyElements();
}

/**
 * Write this. 
 * Taken from: https://stackoverflow.com/questions/47935571/how-to-keep-the-radio-button-remain-checked-after-the-refresh
 */
function studentSelected() {
    userType = "student";
    sessionStorage.setItem("selection", JSON.stringify({ "studentRadio": "checked" }));
    hideKeyElements();
}

/**
 * Write this.
 * Taken from https://stackoverflow.com/questions/3252730/how-to-prevent-a-click-on-a-link-from-jumping-to-top-of-page
 */
$(".button").click(function (event) {
    event.preventDefault();
})

/**
 * Write this.
 */
$(document).ready(function () {
    // sessionStorage.setItem("keyStatus", JSON.stringify({ "key": "invalid" }));
    var selection = sessionStorage.getItem("selection");
    if (selection) {
        if (JSON.parse(selection).studentRadio == "checked") {
            $("#student-radio").attr("checked", "checked");
            $("#educator-radio").removeAttr("checked");
            console.log("you're a student");
        } else {
            $("#educator-radio").attr("checked", "checked");
            $("#student-radio").removeAttr("checked");
            console.log("you're a teacher");
        }
    }
    checkUserType();
    console.log(userType);
});

