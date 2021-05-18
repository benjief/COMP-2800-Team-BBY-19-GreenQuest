function onClickMyQuest() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            db.collection("Students")
                .doc(somebody.uid)
                // Read
                .get()
                .then(function (doc) {
                    // Extract the current student's quest
                    hasQuest = doc.data().Student_Quest;
                    if (hasQuest == true) {
                        window.location.assign("/html/student-view-quest.html");
                    } else {
                        window.location.assign("/html/student-choose-quest.html");
                    }
                });
        }
    });
}