// JS for educator-manage-class.js

// Pull class name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Add Students to " + className);

/**
 * Adds the current class to the link address of the selected option.
 */
function onClick() {
    $(document).click(function (event) {
        let redirectLink = $(event.target).attr("href");
        redirectLink += "?classname=" + className;
        $(event.target).attr("href", redirectLink);
    });
}

/**
 * Write this.
 */
function checkAddStudents() {
    db.collection("Students")
        .where("Student_Class", "==", null)
        .get()
        .then((querySnapshot) => {
            let numStudents = querySnapshot.size;
            if (numStudents > 0) {
                enableAddStudents();
            }
        })
        .catch((error) => {
            console.log("Error getting students not in a class: ", error);
        });
}

/**
 * Write this.
 */
function checkRemoveStudents() {
    console.log(className);
    db.collection("Students")
        .where("Student_Class", "==", className)
        .get()
        .then((querySnapshot) => {
            let numStudents = querySnapshot.size;
            if (numStudents > 0) {
                enableRemoveStudents();
            }
            console.log(numStudents);
        })
        .catch((error) => {
            console.log("Error getting students in class: ", error);
        });
}

/** Write this. */
function enableAddStudents() {
    $("#card-button-container-1 a").attr("onclick", "onClick()");
    $("#card-button-container-1 a").attr("href", "./educator-add-students.html");
    $("#card-button-container-1").removeClass("inactive");
}

/** Write this. */
function enableRemoveStudents() {
    $("#card-button-container-2 a").attr("onclick", "onClick()");
    $("#card-button-container-2 a").attr("href", "./educator-remove-students.html");
    $("#card-button-container-2").removeClass("inactive");
}

/**
 * Write this.
 */
function onClickDeleteClass() {
    if (confirm("Are you sure?")) {
        deleteClass();
    } else {
        console.log("Delete class cancelled.");
    }
}

/**
 * Write this.
 */
function deleteClass() {
    db.collection("Classes").doc(className)
        .delete()
        .then(() => {
            console.log("Class successfully deleted!");
            db.collection("Students")
                .where("Student_Class", "==", className)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.size == 0) {
                        location.href = "./educator-home.html";
                    }
                    querySnapshot.forEach((doc) => {
                        resetStudentClass(doc.id);
                    })
                })
        }).catch((error) => {
            console.error("Error deleting class: ", error);
        });
}

/**
 * Write this.
 */
function resetStudentClass(student) {
    db.collection("Students").doc(student).update({
        Student_Class: null,
        Student_Educator: null
    })
        .then(() => {
            console.log("Student successfully reset!");
            location.href = "./educator-home.html";
        })
        .catch((error) => {
            console.error("Error resetting student to this class: ", error);
        });
}

// Run function when document is ready 
$(document).ready(function () {
    checkAddStudents();
    checkRemoveStudents();
});
