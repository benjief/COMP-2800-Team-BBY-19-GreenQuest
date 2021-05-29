// JS for student-all-classes.js

var studentClassName = null;
var classes = [];
var firstPlace = 0;
var secondPlace = 0;
var thirdPlace = 0;
var classScores = [];

/**
 * Delay timer for a spinner that spins while the page is loading to help users understand what is happening.
 * The spinner is present for 500 milliseconds before being hidden.
 * @author w3schools
 * @see https://www.w3schools.com/howto/howto_css_loader.asp
 */
 function delayTimer() {
    setTimeout(removeSpinner, 1300);
}

/**
 * Sets the spinner's display to none.
 */
function removeSpinner() {
    document.getElementById("loader").style.display = "none";
}
// Run the delay timer 
delayTimer();

/**
 * Gets the current user's class name (if it exists) from the "Students" collection in Firestore.
 */
function getClassName() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                .get()
                .then(function (doc) {
                    studentClassName = doc.data().Student_Class;
                    getClasses();
                });
        }
    });
}

/** 
 * Reads all calls' nicknames and scores from Firestore, orders them by points (descending), creates JSON objects out of their
 * nicknames and point totals, and stores them in the classes array.
 */
function getClasses() {
    db.collection("Classes")
        .orderBy("Class_Points", "desc")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let classObject = { "name": doc.data().Class_Nickname, "points": doc.data().Class_Points.toString() };
                classes.push(classObject);
            });
            getTopScores();
        })
}

/**
 * Pushes class points to an array and then sorts them in descending order. Once this is done, a set is created (so that only
 * unique values are stored) and used to determine first, second and third places (i.e. the highest, second highest and third
 * highest scores). Finally, these are stored in appropriately-named variables.
 * Sorting algorithm taken directly from @author w3schools
 * @see https://www.w3schools.com/js/js_array_sort.asp
 */
function getTopScores() {
    for (var i = 0; i < classes.length; i++) {
        classScores.push(classes[i].points);
    }
    classScores.sort(function (a, b) { return b - a });
    classScoresSet = new Set(classScores);
    let iterator = classScores.values();
    if (classScoresSet.size >= 3) {
        firstPlace = iterator.next().value;
        secondPlace = iterator.next().value;
        thirdPlace = iterator.next().value;
    } else if (classScoresSet.size == 2) {
        firstPlace = iterator.next().value;
        secondPlace = iterator.next().value;
    } else if (classScoresSet.size == 1) {
        firstPlace = iterator.next().value;
    }
    populateClassList(studentClassName);
}

/**
 * Creates elements to be pushed to the DOM in the form of a class list, with class names, points and placements displayed
 * for each entry.
 */
function populateClassList(studentClassName) {
    for (var i = 0; i < classes.length; i++) {
        let classContainer = "<div class='class-container' id='class-container-" + i + "'></div>";
        $(".class-list").append(classContainer);
        createRibbons(i);
        let className = "<p class='class-name' id='class-name-" + i + "'>" + classes[i].name + "</p>";
        $("#class-container-" + i).append(className);
        // Different container color for student's class (if they're in one)
        if (classes[i].name == studentClassName) {
            $("#class-container-" + i).addClass("student-class-container");
        }
        let classPoints = "<p class='class-points' id='class-points-" + i + "'>" + classes[i].points + "</p>";
        $("#class-container-" + i).append(classPoints);

        let leafIcon = "<img id='leaf-icon' src='/img/leaf_icon.png'>"
        $("#class-container-" + i).append(leafIcon);
    }
}

/**
 * Creates a ribbon container, which houses a ribbon image if the class has a top 3 score. If the class is outside of the
 * top 3, it is assigned a placement based on the sorted classScores array, and that number is displayed beside its name
 * (in place of a ribbon).
 * 
 * @param {*} i - The index of the class in the classes array, that is currently being processed
 */
function createRibbons(i) {
    let ribbonContainer = "<div class='ribbon-container' id='ribbon-container-" + i + "'></div>";
    $("#class-container-" + i).append(ribbonContainer);
    if (classes[i].points == firstPlace) {
        var ribbon = "<img src='/img/gold_ribbon.png'>";
    } else if (classes[i].points == secondPlace) {
        var ribbon = "<img src='/img/silver_ribbon.png'>";
    } else if (classes[i].points == thirdPlace) {
        var ribbon = "<img src='/img/bronze_ribbon.png'>";
    } else {
        let classPlacement = classScores.indexOf(classes[i].points) + 1;
        ribbon = "<p 'class-placement'>" + classPlacement + "</p>";
    }
    $("#ribbon-container-" + i).append(ribbon);
}


/**
 * Calls getClassName() to start the function cascade when the page is ready.
 */
$(document).ready(function () {
    getClassName();
});
