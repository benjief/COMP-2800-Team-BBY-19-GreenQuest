'use-strict'
var inst = "instructions";
var docTask = "walking"
const collection = db.collection(inst);
const referenceTask = collection.doc(docTask);

referenceTask.withConverter(taskConverter).get().then((doc) => {
  if (doc.exists) {
    var mytask = doc.data();
    $("#task-title").text(mytask.getTitle());
    $("#task-rating").text(mytask.getDifficulty());
    $("#task-description").text(mytask.getDescription());
    

    //how-to-modal actions
    $('#how-to-modal').on('show.bs.modal', function() {
      referenceTask.get().then((doc) => {
            if (doc.exists) {
              var src = doc.data().link;
              $('iframe').attr('src', src);
              console.log("success");
            }
          }).catch(function(error) {
            console.log("Got an error: ", error);
          });
    })

  } else {
    console.log("No such document");
  }}).catch((error) => {
    console.log("Error getting document: ", error);
  });



// how-to-modal actions.
$('#how-to-modal').on('show.bs.modal', function() {
  referenceTask.get().then((doc) => {
        if (doc.exists) {
          var src = doc.data().link;
          $('iframe').attr('src', src);
          console.log("success");
        }
      }).catch(function(error) {
        console.log("Got an error: ", error);
      });
})

//more-info-modal actions.
$('#more-info-modal').on('show.bs.modal',function() {
  referenceTask.get().then((doc) => {
    if (doc.exists) {
      var src = doc.data().moreInfo;
      $('iframe').attr('src', src);

      console.log("success");
    }
  }).catch(function(error) {
    console.log("Got an error: ", error);
  });
  console.log("testing2");
});

//video stops when modal closes
$('.more-info-modal').on('hide.bs.modal', function() {
  $('.more-info-modal iframe').attr('src', '');
})