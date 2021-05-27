// JS for student-all-classes.js

var studentClassName = null;
var classes = [];
var firstPlace = 0;
var secondPlace = 0;
var thirdPlace = 0;

/**
 * Get the current user's class name from Firestore (if it exists).
 */
function getClassName() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    studentClassName = doc.data().Student_Class;
                    getClasses();
                });
        }
    });
}

/**
 * Appends a list of student names (along with a "+" icon) to the DOM.
 */
function populateClassList(studentClassName) {
    for (var i = 0; i < classes.length; i++) {
        let classContainer = "<div class='class-container' id='class-container-" + i + "'></div>";
        $(".class-list").append(classContainer);
        let ribbonContainer = "<div class='ribbon-container' id='ribbon-container-" + i + "'></div>";
        $("#class-container-" + i).append(ribbonContainer);
        if (classes[i].points == firstPlace) {
            var ribbon = "<img src='/img/gold_ribbon.png'>";
        } else if (classes[i].points == secondPlace) {
            var ribbon = "<img src='/img/silver_ribbon.png'>";
        } else if (classes[i].points == thirdPlace) {
            var ribbon = "<img src='/img/bronze_ribbon.png'>";
        } else {
            ribbon = null;
        }
        $("#ribbon-container-" + i).append(ribbon);
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
 * Write this.
 * Taken from https://www.w3schools.com/js/js_array_sort.asp (sorting algorithm)
 */
function getTopScores() {
    let classScores = [];
    for (var i = 0; i < classes.length; i++) {
        classScores.push(classes[i].points);
    }
    classScores.sort(function (a, b) { return b - a });
    classScores = new Set(classScores);
    let iterator = classScores.values();
    if (classScores.size >= 3) {
        firstPlace = iterator.next().value;
        secondPlace = iterator.next().value;
        thirdPlace = iterator.next().value;
    } else if (classScores == 2) {
        firstPlace = iterator.next().value;
        secondPlace = iterator.next().value;
    } else if (classScores == 1) {
        firstPlace = iterator.next().value;
    }
    populateClassList(studentClassName);
}

/** 
 * Write this.
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
 * Call function when the page is ready.
 */
$(document).ready(function () {
    getClassName();
});


//Load timer
function myFunction() {
    setTimeout(showPage, 1300);
  }
  
  function showPage() {
    document.getElementById("loader").style.display = "none";
  }
  myFunction();
