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
const recycling1 = new Quest("Recycle Bottle", "Throw a recyclable bottle in the blue bin", "1", "https://www.youtube.com/embed/6jQ7y_qQYUA", "https://www.youtube.com/embed/7UuUeoyYmxI");
const recycling2 = new Quest("Recycle Paper", "Throw a piece of old/used paper in the blue bin", "1", "https://www.youtube.com/embed/6jQ7y_qQYUA", "https://www.youtube.com/embed/7UuUeoyYmxI");
const recycling3 = new Quest("Recycle Cardboard", "Throw cardboard in the cardboard bin", "2", "https://www.youtube.com/embed/6jQ7y_qQYUA", "https://www.youtube.com/embed/7UuUeoyYmxI");
const recycling4 = new Quest("Compost", "Throw a food scraps into the green bin.", "2", "https://youtu.be/X-Zr2tqfhTo", "https://youtu.be/-Wl3j9I_KWM");
const walking = new Quest("Walking", "Try walking or biking to places instead of using a car!", "3", "https://www.youtube.com/embed/BWR3DxGHLD4", "https://www.youtube.com/embed/IJoAcD0oUww");
const plant_a_seed = new Quest("Plant a Seed", "Plant any seed into a planter!", "4", "https://www.youtube.com/embed/EsODAlsY4NM", "https://www.youtube.com/embed/ib5uiLMM2wY");
const plant_a_tree = new Quest("Plant a Tree", "Plant a tree seed in a planter!", "5", "https://www.youtube.com/embed/N7fIqlLB1eU", "https://www.youtube.com/embed/z_KMN8532co");
const turn_off_light = new Quest("Turn off Light", "Turn off the light when you are not using it.", "1", "https://www.youtube.com/embed/DfrHBy6YPj0", "https://www.youtube.com/embed/QH9pk7diKjA");
const turn_off = new Quest("Turn off!", "Turn off the things like the faucet, light, and TV when you are done using it!", "1", "https://www.youtube.com/embed/6xJU5jZgnJI", "https://www.youtube.com/embed/6xJU5jZgnJI");
const buy_local_products = new Quest("Buy Things Local", "Buy food that is locally grown in your city, neighbourhood, or home!", "3", "https://www.youtube.com/embed/qi7JB4Cm-64", "https://www.youtube.com/embed/98UZ-Sltr9Y");
const public_transportation = new Quest("Go to school with public transportation!", "Take a bus or skytrain.", "4", "https://www.youtube.com/embed/eINQdeux2yg", "https://www.youtube.com/embed/keeQJBkPqPg");
const conserve_water1 = new Quest("Less Tap Water", "Turn off the tap while brushing your teeth", "2", "https://www.youtube.com/embed/rl0YiZjTqpw", "https://www.youtube.com/watch?v=Ljgrb8nQovs");
const conserve_water2 = new Quest("Short Shower", "Take a shorter shower", "3", "https://www.youtube.com/embed/rl0YiZjTqpw", "https://www.youtube.com/watch?v=Ljgrb8nQovs");
const change_light_bulbs = new Quest("Change lightbulbs!", "Let's change your light bulbs to LED!", "4", "https://www.youtube.com/embed/V2DcTXdhV_I", "https://www.youtube.com/embed/eJ0f_L1Kjs0");


//sending to firestore to save under each document.
questRef.doc("recycling1").withConverter(questConverter).set(recycling1);
questRef.doc("recycling2").withConverter(questConverter).set(recycling2);
questRef.doc("recycling3").withConverter(questConverter).set(recycling3);
questRef.doc("recycling4").withConverter(questConverter).set(recycling4);
questRef.doc("walking").withConverter(questConverter).set(walking);
questRef.doc("plant_a_seed").withConverter(questConverter).set(plant_a_seed);
questRef.doc("plant_a_tree").withConverter(questConverter).set(plant_a_tree);
questRef.doc("turn_off_light").withConverter(questConverter).set(turn_off_light);
questRef.doc("turn_off").withConverter(questConverter).set(turn_off);
questRef.doc("buy_local_products").withConverter(questConverter).set(buy_local_products);
questRef.doc("public_transportation").withConverter(questConverter).set(public_transportation);
questRef.doc("conserve_water1").withConverter(questConverter).set(conserve_water1);
questRef.doc("conserve_water2").withConverter(questConverter).set(conserve_water2);
questRef.doc("change_light_bulbs").withConverter(questConverter).set(change_light_bulbs);

console.log("Quest adding successful");
