'use-strict'
var inst = "instructions";
const myCollections = db.collection(inst);

// var docTask = "turn_off_light"
// const referenceTask = myCollections.doc(docTask);

//trying to create an array of current tasks available 
//to call three? or to call random one
//calling random index of the list.
var myListOfTasks = new Array();

myCollections.get().then((querySnapShot) => {
  querySnapShot.forEach((doc) => {
    myListOfTasks.push(doc.data());
  });
});

console.log(myListOfTasks);


//random integer generator from MDN webdocs. 
//source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var docTask = myListOfTasks[getRandomInt(myListOfTasks.length)];
const referenceTask = myCollections.doc(docTask);


referenceTask.withConverter(taskConverter).get().then((doc) => {
  if (doc.exists) {
    var mytask = doc.data();
    $("#task-title").text(mytask.getTitle());
    $("#task-rating").text(mytask.getDifficulty());
    $("#task-description").text(mytask.getDescription());
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
});



