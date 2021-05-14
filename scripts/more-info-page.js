'use-strict'
var inst = "Tasks";
const myCollections = db.collection(inst);

// var docTask = "recycling"
// const referenceTask = myCollections.doc(docTask);

//random integer generator from MDN webdocs. 
//source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//trying to create an array of current tasks available 
//to call three? or to call random one
//calling random index of the list.
var myListOfTasks = [];
var referenceTask;
var docTask;
var docTask2;
var docTask3;

myCollections.get().then((querySnapShot) => {
  querySnapShot.forEach((doc) => {
    myListOfTasks.push(doc.id);
  });

  //task 1 of 3 on the page
  docTask = myListOfTasks[getRandomInt(myListOfTasks.length)];
  referenceTask = myCollections.doc(docTask);
  taskCardLoadingFromFirebase();
  howToModalAction();
  moreInfoModalAction();

  docTask2 = myListOfTasks[getRandomInt(myListOfTasks.length)];
  referenceTask = myCollections.doc(docTask2);

  taskCardLoadingFromFirebase2();
  howToModalAction();
  moreInfoModalAction();

  docTask3 = myListOfTasks[getRandomInt(myListOfTasks.length)];
  referenceTask = myCollections.doc(docTask3);

  taskCardLoadingFromFirebase3();
  howToModalAction();
  moreInfoModalAction();
});




function taskCardLoadingFromFirebase() {
  referenceTask.withConverter(taskConverter).get().then((doc) => {
    if (doc.exists) {
      var mytask = doc.data();
      $("#task-title").text(mytask.getTitle());
      $("#difficulty").html('Difficulty: ' + mytask.getDifficultyStars());
      $("#task-description").text(mytask.getDescription());
      console.log("converting successful.");
    } else {
      console.log("No such document");
    }}).catch((error) => {
      console.log("Error getting document: ", error);
    });
}

function taskCardLoadingFromFirebase2() {
  referenceTask.withConverter(taskConverter).get().then((doc) => {
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


