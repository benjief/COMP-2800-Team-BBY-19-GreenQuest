// JS for educator-manage-class.js

// Pull class name from URL and display it in the DOM (more specifically, the page header)
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Add Students to " + className);

/**
 * Searches the "Students" collection in Firestore for documents that have a populated Student_Class field.
 * If the query returns results (i.e. classless students exist), enableAddStudents() is called. If not, nothing
 * changes and the "Add Students" button remains inactive.
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
 * Searches the "Students" collection in Firestore for documents whose Student_Class field matches the current class being
 * managed. If the query returns results (there are students in the class), enableRemoveStudents() is called. If not, nothing
 * changes and the "Remove Students" button remains inactive.
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

/**
 * Changes the "Add Students" button from an inactive to an active state.
 */
function enableAddStudents() {
    $("#card-button-container-1 a").attr("onclick", "onClick()");
    $("#card-button-container-1 a").attr("href", "./educator-add-students.html");
    $("#card-button-container-1").removeClass("inactive");
}

/**
 * Changes the "Remove Students" button from an inactive to an active state.
 */
function enableRemoveStudents() {
    $("#card-button-container-2 a").attr("onclick", "onClick()");
    $("#card-button-container-2 a").attr("href", "./educator-remove-students.html");
    $("#card-button-container-2").removeClass("inactive");
}

/**
 * When a user clicks on the "Delete Class" button, they are prompted with an alert asking
 * them if they're sure they want to proceed. If they click "Okay," deleteClass() is called. 
 * If they click "Cancel," the deletion is cancelled.
 */
function onClickDeleteClass() {
    if (confirm("Are you sure?")) {
        deleteClass();
    } else {
        console.log("Delete class cancelled.");
    }
}

/**
 * If a user chooses to delete the class currently being managed, the class document is
 * removed from the "Classes" collection in Firestore. Then, all student documents whose
 * Student_Class fields match the deleted class' name are passed into resetStudentClass().
 * If no such documents exist, the user is directed back to the educator homepage.
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
 * Student documents whose class has just been removed from the database have their 
 * Student_Class and Student_Educator fields reset to null, since they are now, once again,
 * classless. Following this, the user is redirected back to the educator homepage.
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


/**
 * Adds the current class to the link address of the selected option. For example, if the
 * "Add Students" button is selected, the user is redirected to "./educator-add-students?classname=className,"
 * where className contains the actual name of the class being managed. This URL query string value is
 * parsed at the destination and used there.
 */
function onClick() {
    $(document).click(function (event) {
        let redirectLink = $(event.target).attr("href");
        redirectLink += "?classname=" + className;
        $(event.target).attr("href", redirectLink);
    });
}

/**
 * Calls checkAddStudents() and checkRemoveStudents() when the page is ready.
 */
$(document).ready(function () {
    checkAddStudents();
    checkRemoveStudents();
});
