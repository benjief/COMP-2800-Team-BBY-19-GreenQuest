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
      var mytask = doc.data();
      $("#task-title2").text(mytask.getTitle());
      $("#difficulty2").html('Difficulty: ' + mytask.getDifficultyStars());
      $("#task-description2").text(mytask.getDescription());
      console.log("converting successful.");
    } else {
      console.log("No such document");
    }}).catch((error) => {
      console.log("Error getting document: ", error);
    });
}

function taskCardLoadingFromFirebase3() {
  referenceTask.withConverter(taskConverter).get().then((doc) => {
    if (doc.exists) {
      var mytask = doc.data();
      $("#task-title3").text(mytask.getTitle());
      $("#difficulty3").html('Difficulty: ' + mytask.getDifficultyStars());
      $("#task-description3").text(mytask.getDescription());
      console.log("converting successful.");
    } else {
      console.log("No such document");
    }}).catch((error) => {
      console.log("Error getting document: ", error);
    });
}




// how-to-modal actions.
function howToModalAction() {
  $('#how-to-modal').on('show.bs.modal', function() {
    referenceTask.get().then((doc) => {
          if (doc.exists) {
            var src = doc.data().instruction;
            $('iframe').attr('src', src);
            console.log("success");
          }
        }).catch(function(error) {
          console.log("Got an error: ", error);
        });
  });
}


//more-info-modal actions.
function moreInfoModalAction() {
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
}


//video stops when modal closes
$('.more-info-modal').on('hide.bs.modal', function() {
  $('.more-info-modal iframe').attr('src', '');
});

//video stops when modal closes
$('#more-info-modal').on('hide.bs.modal', function() {
  $('#more-info-modal iframe').attr('src', '');
})
    
