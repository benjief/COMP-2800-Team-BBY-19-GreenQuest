'use-strict'
const recyclingRef = db.collection("instructions").doc("recycling");
const instructionBtn = document.querySelector("#instructionBtn");
const instruction = document.querySelector("#instruction");


instructionBtn.addEventListener("click",function() {
  recyclingRef.get().then((doc) => {
    if (doc.exists) {
      instruction.innerHTML = "<iframe src='" + doc.data().link + "' title = '" + doc.data().task + "'></iframe>";
      console.log("success");
    }
  }).catch(function(error) {
    console.log("Got an error: ", error);
  });
  console.log("testing2");
});

// db.collection("instructions").get().then((querySnapshot) => {
//   console.log("testing");
//   querySnapshot.forEach((doc) => {
//     console.log("testing");

//       console.log(`${doc.id} => ${doc.data()}`);
//   });
// });
