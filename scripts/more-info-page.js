'use-strict'
const instructionRef = db.collection("instruction");
const instructionBtn = document.querySelector("#instructionBtn");
const instruction = document.querySelector("#instruction");


instructionBtn.addEventListener("click",function() {
  instructionRef.document("recycling").get().then(function(doc) {
    if (doc && doc.exists) {
      const myData = doc.data();
      instruction.innerHTML = myData.task;
    }
  }).catch(function(error) {
    console.log("Got an error: ", error);
  });
});

console.log("testing");