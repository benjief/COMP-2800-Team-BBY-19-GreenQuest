function readTask(){
    db.collection("Task").doc("recycling")
    .onSnapshot(function(snap) {
        console.log(snap.data());
        console.log(snap.data().message);
        document.getElementById("abc").innerText = snap.data().message;
})
}

readTask;