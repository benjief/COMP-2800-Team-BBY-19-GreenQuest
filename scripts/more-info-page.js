'use-strict'
const recyclingRef = db.collection("instructions").doc("recycling");
const instructionBtn = document.querySelector("#instructionBtn");
const instruction = document.querySelector("#instruction");


instructionBtn.addEventListener("click",function() {
  recyclingRef.get().then((doc) => {
    if (doc.exists) {
      var src = doc.data().link;
      $('#instruction iframe').attr('src', src);
      console.log("success");
      console.log(doc.data().link);

    }
  }).catch(function(error) {
    console.log("Got an error: ", error);
  });
  console.log("testing2");
});

// stackoverflow boostrap and youtube in modal.
// src: https://stackoverflow.com/questions/18622508/bootstrap-3-and-youtube-in-modal
// accessed on: May 7, 2021

//modified by Giwoun Bae
$('#instruction button.close').on('hidden.bs.modal', function () {
  $('#instruction iframe').removeAttr('src');
});



    