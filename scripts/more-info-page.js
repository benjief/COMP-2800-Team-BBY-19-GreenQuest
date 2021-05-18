'use-strict'
var inst = "Quests";
const myCollections = db.collection(inst);

// var docQuest = "recycling"
// const referenceQuest = myCollections.doc(docQuest);

//random integer generator from MDN webdocs. 
//source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//trying to create an array of current quests available 
//to call three? or to call random one
//calling random index of the list.
var myListOfQuests = [];
var referenceQuest;
var docQuest;
var docQuest2;
var docQuest3;

myCollections.get().then((querySnapShot) => {
  querySnapShot.forEach((doc) => {
    myListOfQuests.push(doc.id);
  });

  //quest 1 of 3 on the page
  docQuest = myListOfQuests[getRandomInt(myListOfQuests.length)];
  referenceQuest = myCollections.doc(docQuest);
  questCardLoadingFromFirebase();
  howToModalAction();
  moreInfoModalAction();

  docQuest2 = myListOfQuests[getRandomInt(myListOfQuests.length)];
  referenceQuest = myCollections.doc(docQuest2);

  questCardLoadingFromFirebase2();
  howToModalAction();
  moreInfoModalAction();

  docQuest3 = myListOfQuests[getRandomInt(myListOfQuests.length)];
  referenceQuest = myCollections.doc(docQuest3);

  questCardLoadingFromFirebase3();
  howToModalAction();
  moreInfoModalAction();
});




function questCardLoadingFromFirebase() {
  referenceQuest.withConverter(questConverter).get().then((doc) => {
    if (doc.exists) {
      var myquest = doc.data();
      $("#quest-title").text(myquest.getTitle());
      $("#difficulty").html('Difficulty: ' + myquest.getDifficultyStars());
      $("#quest-description").text(myquest.getDescription());
      console.log("converting successful.");
    } else {
      console.log("No such document");
    }}).catch((error) => {
      console.log("Error getting document: ", error);
    });
}

function questCardLoadingFromFirebase2() {
  referenceQuest.withConverter(questConverter).get().then((doc) => {
    if (doc.exists) {
      var myquest = doc.data();
      $("#quest-title2").text(myquest.getTitle());
      $("#difficulty2").html('Difficulty: ' + myquest.getDifficultyStars());
      $("#quest-description2").text(myquest.getDescription());
      console.log("converting successful.");
    } else {
      console.log("No such document");
    }}).catch((error) => {
      console.log("Error getting document: ", error);
    });
}

function questCardLoadingFromFirebase3() {
  referenceQuest.withConverter(questConverter).get().then((doc) => {
    if (doc.exists) {
      var myquest = doc.data();
      $("#quest-title3").text(myquest.getTitle());
      $("#difficulty3").html('Difficulty: ' + myquest.getDifficultyStars());
      $("#quest-description3").text(myquest.getDescription());
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
    referenceQuest.get().then((doc) => {
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
    referenceQuest.get().then((doc) => {
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



