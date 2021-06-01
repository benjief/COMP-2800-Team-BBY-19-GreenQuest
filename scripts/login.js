// JS for login.html

var userType = "educator";
// *** OUR EDUCATOR KEY ***
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
            if (authResult.additionalUserInfo.isNewUser) { // If new user
                /* Write a student document to the "Students" collection in Firestore with
                   the following attributes: */
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
                            /* Redirect to the student homepage (with a firstvisit=true tag)
                               after signup */
                            window.location.assign(
                                "/html/student-home.html?firstvisit=true"
                            );
                        })
                        .catch(function (error) {
                            console.log("Error adding new student: " + error);
                        });
                } else {
                    /* Write an educator document to the "Educators" collection in Firestore with
                       the following attributes: */
                    db.collection("Educators").doc(user.uid).set({
                        Educator_Name: user.displayName,
                        Educator_Email: user.email,
                        User_Type: "educator"
                    })
                        .then(function () {
                            console.log("New educator added to firestore");
                            // Redirect to the new educator homepage after signup
                            window.location.assign(
                                "/html/educator-new-home.html"
                            );
                        })
                        .catch(function (error) {
                            console.log("Error adding new educator: " + error);
                        });
                }
            } else {
                /* If the user is an established educator, redirect them to the 
                   regular educator homepage */
                if (userType === "educator") {
                    window.location.assign("/html/educator-home.html");
                    /* If the user is an established student, redirect them to the 
                       student homepage without a special tag */
                } else if (userType === "student") {
                    window.location.assign("/html/student-home.html");
                }
            }
            return true;
        },
    },
    /* Get rid of page reload when a user signs in with email (this was causing lots of issues 
       with our radio buttons) */
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
 * Assigns userType based on the radio button selected. If userType == educator and
 * a valid key hasn't been input, the Firebase login widget won't be displayed. If a valid
 * key has been input, the widget is displayed and fully functional (always the case for students,
 * who aren't required to input a key).
 */
function checkUserType() {
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
 * Hides educator-specific key input DOM elements and displays the Firebase login widget.
 */
function hideKeyElements() {
    $("#input-container").css({ display: "none" });
    $("#feedback-placeholder").css({ display: "none" });
    $("#card-button-container-1").css({ display: "none" });
    $("#firebaseui-auth-container").css({ display: "" });
}

/**
 * Pushes educator-specific key input elements to the DOM and hides the Firebase login widget.
 * Also checks to see if a valid key has been input, and if it has, key input elements are hidden,
 * and the Firebase login widget is displayed.
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
 * When an educator has entered a key and clicked on the "Submit" button, their input is 
 * stored and fed into checkInput(). If the key is deemed to be valid, a success message is 
 * posted to the DOM and the fact that a valid key has been entered is written to session storage.
 * Finally, key-input-related DOM elements are hidden and the Firebase login widget is displayed.
 */
function onClickSubmit() {
    let key = document.getElementById("educator-validation").value;
    checkInput(key);
    if (validKey == true) {
        // Display success message
        $("#feedback").html("Success! Please wait...");
        $("#feedback").css({
            color: "green"
        });
        $(feedback).show(0);
        $(feedback).fadeOut(1000);
        setTimeout(function () {
            // Store record of a valid key entry event
            sessionStorage.setItem("keyStatus", JSON.stringify({ "key": "valid" }));
            // Hide key-input DOM elements and display the Firebase login widget
            $("#input-container").css({ display: "none" });
            $("#feedback-placeholder").css({ display: "none" });
            $("#card-button-container-1").css({ display: "none" });
            $("#firebaseui-auth-container").css({ display: "" });
        }, 1000);
    }
}

/**
 * Checks to see if the key input by an educator matches educatorKey (defined at the
 * top of this file). If it does, validKey is set to true and control is passed back to 
 * onClickSubmit(). If it doesn't, an error message is displayed, prompting the user to 
 * enter a valid key.
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
 * If the educator radio button is selected, userType is set to "educator" and the fact that the
 * student radio button is unchecked is written to session storage before showKeyElements() is called.
 */
function educatorSelected() {
    userType = "educator";
    sessionStorage.setItem("selection", JSON.stringify({ "studentRadio": "unchecked" }));
    showKeyElements();
}

/**
 * If the student radio button is selected, userType is set to "student" and the fact that the
 * student radio button is checked is written to session storage before hideKeyElements() is called.
 */
function studentSelected() {
    userType = "student";
    sessionStorage.setItem("selection", JSON.stringify({ "studentRadio": "checked" }));
    hideKeyElements();
}

/**
 * Prevents the page from jumping upwards when an educator clicks on the "Submit" button after
 * inputting their key. This way, any feedback pushed to the DOM can be seen without quickly 
 * scrolling back down again.
 */
$(".button").click(function (event) {
    event.preventDefault();
})

function checkTimeOfDay() {
    let timeOfDay = new Date();
    if ((21 <= timeOfDay.getHours() && (timeOfDay.getHours() <= 23))
        || (0 <= timeOfDay.getHours() && timeOfDay.getHours() <= 4)) {
        $(document.body).css({ backgroundImage: "url('/img/background_clouds_night.png')" });
        $(".page-heading").css({ color: "#fff345" });
        $(".student-points-container img").attr("src", "/img/leaf_icon_night.png");
        $(".student-points-container p").css({ color: "#fff345" });
    } else if ((19 <= timeOfDay.getHours() && (timeOfDay.getHours() < 21))
        || (4 < timeOfDay.getHours() && timeOfDay.getHours() <= 7)) {
        $(document.body).css({ backgroundImage: "url('/img/background_clouds_dawn_dusk.png')" });
        $(".page-heading").css({ color: "white" });
        $(".student-points-container img").attr("src", "/img/leaf_icon.png");
        $(".student-points-container p").css({ color: "#ff7b00" });
    }
}

/**
 * When the document is ready, session storage is checked to see if a previous
 * radio button selection was made (in the same session). If it was, the page will re-
 * check the same selection without the user having to do so. Following this, checkUserType()
 * is called and the rest of the login function cascade begins.
 */
$(document).ready(function () {
    var selection = sessionStorage.getItem("selection");
    if (selection) {
        if (JSON.parse(selection).studentRadio == "checked") {
            $("#student-radio").attr("checked", "checked");
            $("#educator-radio").removeAttr("checked");
        } else {
            $("#educator-radio").attr("checked", "checked");
            $("#student-radio").removeAttr("checked");
        }
    }
    checkUserType();
    checkTimeOfDay();
});
