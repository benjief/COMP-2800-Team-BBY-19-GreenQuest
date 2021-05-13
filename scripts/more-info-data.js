const taskRef = db.collection("Tasks");




//Creating task objects.
const recycling = new Task("recycle", "Throw recyclable bottle in the recycle bin", "easy", "https://www.youtube.com/embed/6jQ7y_qQYUA", "https://www.youtube.com/embed/7UuUeoyYmxI");
const walking = new Task("walking", "Try walking or biking to places!", "easy", "https://www.youtube.com/embed/BWR3DxGHLD4","for more info");
const plant_a_seed = new Task("Plant a seed", "Try a seed to grow something!", "medium", "https://www.youtube.com/embed/BWR3DxGHLD4", "for more info");
const plant_a_tree = new Task("Plant a Tree", "Try planting a tree!", "medium", "https://www.youtube.com/embed/N7fIqlLB1eU", "more info");
const turn_off_light = new Task("Turn off Light", "When you leave your room, turn off the light!", "easy", "https://www.youtube.com/embed/DfrHBy6YPj0", "for more info");
const turn_off = new Task("Turn off!", "Turn off when you are done using it!", "easy", "https://www.youtube.com/embed/6xJU5jZgnJI", "more info");
const buy_local_products = new Task("Buy Things Local", "Reduce product transportation carbon emission by purchasing locally grown or manufactured products.", "medium", "Instruction", "For more info");
const public_transportation = new Task("Try bus! (Public transportation)", "Try taking a public transit (bus, skytrain)!", "medium", "instruction", "reducing carbon emission");
const conserve_water = new Task("Just a little water!", "Try to use less water for a day!", "easy", "Tell mommy to use less water!", "More fresh water!");
const change_light_bulbs = new Task("Change lightbulbs!", "Let's change your light bulbs to LED!", "medium", "We need our parents help! Lets go buy the light bulb together", "more info");


//sending to firestore to save under each document.
taskRef.doc("recycling").withConverter(taskConverter).set(recycling);
taskRef.doc("walking").withConverter(taskConverter).set(walking);
taskRef.doc("plant_a_seed").withConverter(taskConverter).set(plant_a_seed);
taskRef.doc("plant_a_tree").withConverter(taskConverter).set(plant_a_tree);
taskRef.doc("turn_off_light").withConverter(taskConverter).set(turn_off_light);
taskRef.doc("turn_off").withConverter(taskConverter).set(turn_off);
taskRef.doc("buy_local_products").withConverter(taskConverter).set(buy_local_products);
taskRef.doc("public_transportation").withConverter(taskConverter).set(public_transportation);
taskRef.doc("conserve_water").withConverter(taskConverter).set(conserve_water);
taskRef.doc("change_light_bulbs").withConverter(taskConverter).set(change_light_bulbs);

console.log("adding successfull");
