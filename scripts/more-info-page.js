'use-strict'
const recyclingRef = db.collection("instructions").doc("recycling");

//how-to-modal actions.
$('#how-to-modal').on('show.bs.modal', function() {
  recyclingRef.get().then((doc) => {
        if (doc.exists) {
          var src = doc.data().link;
          $('#instruction iframe').attr('src', src);
          console.log("success");
        }
      }).catch(function(error) {
        console.log("Got an error: ", error);
      });
})

//video stops when modal closes
$('#how-to-modal').on('hide.bs.modal', function() {
  $('#instruction iframe').attr('src', '');
})

//more-info-modal actions.
$('#more-info-modal').on('show.bs.modal',function() {
  recyclingRef.get().then((doc) => {
    if (doc.exists) {
      var src = doc.data().moreInfo;
      $('#moreInfo iframe').attr('src', src);

      console.log("success");
    }
  }).catch(function(error) {
    console.log("Got an error: ", error);
  });
  console.log("testing2");
});

//video stops when modal closes
$('#more-info-modal').on('hide.bs.modal', function() {
  $('#more-info-modal iframe').attr('src', '');
})
    
