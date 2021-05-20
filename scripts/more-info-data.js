'use strict'
class Quest {
  constructor(title, description, difficulty, instruction, moreInfo) {
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.instruction = instruction;
    this.moreInfo = moreInfo;
  }

  getTitle() {
    return this.title;
  }

  getDifficulty() {
    return this.difficulty;
  }

  getDifficultyStars() {
    const maxDifficulty = 5;
    const rating = this.difficulty;
    const fullStar = ' <i class="fas fa-star stars"></i>'.repeat(Math.ceil(rating));
    const noStar = ' <i class="far fa-star stars"></i>'.repeat(Math.floor(maxDifficulty - rating));
    return `${fullStar}${noStar}`;
  }

  getDescription() {
    return this.description;
  }

  getInstruction() {
  }
}

// Firestore data converter
var questConverter = {
  toFirestore: function (quest) {
    return {
      title: quest.title,
      description: quest.description,
      difficulty: quest.difficulty,
      instruction: quest.instruction,
      moreInfo: quest.moreInfo
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Quest(data.title, data.description, data.difficulty, data.instruction, data.moreInfo);
  }
};



//This is to create database.
//You can add/edit here and it will be shown on firestore realtime.
const questRef = db.collection("Quests");

//Creating quest objects.
const recycling = new Quest("recycle", "Throw recyclable bottle in the recycle bin", "1", "https://www.youtube.com/embed/6jQ7y_qQYUA", "https://www.youtube.com/embed/7UuUeoyYmxI");
const walking = new Quest("walking", "Try walking or biking to places!", "3", "https://www.youtube.com/embed/BWR3DxGHLD4", "https://www.youtube.com/embed/IJoAcD0oUww");
const plant_a_seed = new Quest("Plant a seed", "Try a seed to grow something!", "4", "https://www.youtube.com/embed/EsODAlsY4NM", "https://www.youtube.com/embed/ib5uiLMM2wY");
const plant_a_tree = new Quest("Plant a Tree", "Try planting a tree!", "5", "https://www.youtube.com/embed/N7fIqlLB1eU", "https://www.youtube.com/embed/z_KMN8532co");
const turn_off_light = new Quest("Turn off Light", "When you leave your room, turn off the light!", "1", "https://www.youtube.com/embed/DfrHBy6YPj0", "https://www.youtube.com/embed/QH9pk7diKjA");
const turn_off = new Quest("Turn off!", "Turn off when you are done using it!", "1", "https://www.youtube.com/embed/6xJU5jZgnJI", "https://www.youtube.com/embed/6xJU5jZgnJI");
const buy_local_products = new Quest("Buy Things Local", "Reduce product transportation carbon emission by purchasing locally grown or manufactured products.", "3", "https://www.youtube.com/embed/qi7JB4Cm-64", "https://www.youtube.com/embed/98UZ-Sltr9Y");
const public_transportation = new Quest("Try bus! (Public transportation)", "Try taking a public transit (bus, skytrain)!", "4", "https://www.youtube.com/embed/eINQdeux2yg", "https://www.youtube.com/embed/keeQJBkPqPg");
const conserve_water = new Quest("Just a little water!", "Try to use less water for a day!", "2", "https://www.youtube.com/embed/rl0YiZjTqpw", "https://www.youtube.com/watch?v=Ljgrb8nQovs");
const change_light_bulbs = new Quest("Change lightbulbs!", "Let's change your light bulbs to LED!", "4", "https://www.youtube.com/embed/V2DcTXdhV_I", "https://www.youtube.com/embed/eJ0f_L1Kjs0");


//sending to firestore to save under each document.
questRef.doc("recycling").withConverter(questConverter).set(recycling);
questRef.doc("walking").withConverter(questConverter).set(walking);
questRef.doc("plant_a_seed").withConverter(questConverter).set(plant_a_seed);
questRef.doc("plant_a_tree").withConverter(questConverter).set(plant_a_tree);
questRef.doc("turn_off_light").withConverter(questConverter).set(turn_off_light);
questRef.doc("turn_off").withConverter(questConverter).set(turn_off);
questRef.doc("buy_local_products").withConverter(questConverter).set(buy_local_products);
questRef.doc("public_transportation").withConverter(questConverter).set(public_transportation);
questRef.doc("conserve_water").withConverter(questConverter).set(conserve_water);
questRef.doc("change_light_bulbs").withConverter(questConverter).set(change_light_bulbs);

console.log("adding successfull");
