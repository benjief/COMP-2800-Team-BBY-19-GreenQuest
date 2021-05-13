const taskRef = db.collection("instructions");

taskRef.doc("recycling").set({
  title: "Recyling Plastic Wastes",
  description: "Take your plastic wastes to any recycling facility",
  difficulty: "medium",
  link: "https://www.youtube.com/embed/6jQ7y_qQYUA",
  schoolAge: "middle",
  moreInfo: "https://www.youtube.com/embed/7UuUeoyYmxI"
});

taskRef.doc("walking").set({
  title: "Walk Instead of Using a Car",
  description: "Reduce carbon emission by walking to nearby places rather" +
    "than driving",
  difficulty: "easy",
  link: "https://www.youtube.com/embed/6jQ7y_qQYUA",
  schoolAge: "middle",
  moreInfo: "https://www.youtube.com/embed/7UuUeoyYmxI"
});

taskRef.doc("plant_a_seed").set({
  title: "Plant a Seed",
  description: "In your local community or at home plant a seed of any" +
  "kind of plant",
  difficulty: "easy - medium",
  link: "https://www.youtube.com/embed/BWR3DxGHLD4",
  schoolAge: "middle",
  moreInfo: ""
});

taskRef.doc("plant_a_tree").set({
  title: "Plant a Tree",
  description: "Plant a tree in your local community or at home",
  difficulty: "medium",
  link: "https://www.youtube.com/embed/N7fIqlLB1eU",
  schoolAge: "middle",
  moreInfo: ""
});

taskRef.doc("turn_off_light").set({
  title: "Turn Off Any Unused light",
  description: "Reduce electricity usage by turning off any" +
  " unused light",
  difficulty: "easy",
  link: "https://www.youtube.com/embed/DfrHBy6YPj0",
  schoolAge: "elementary",
  moreInfo: ""
});

taskRef.doc("plant_based_diet").set({
  title: "Plant Based Diet For a Day",
  description: "Reduce meat on your plate and consume a plant based" +
  " diet for the day",
  difficulty: "medium",
  link: "",
  schoolAge: "middle",
  moreInfo: ""
});


taskRef.doc("composting").set({
  title: "Composting Your Left-Over Food Scraps",
  description: "Compost your left-over food scraps rather than" +
  " placing it directly into garbage",
  difficulty: "easy",
  link: "",
  schoolAge: "elementary",
  moreInfo: ""
});

taskRef.doc("buy_local_products").set({
  title: "Buy Things Local",
  description: "Reduce product transportation carbon emission" +
  " by purchasing locally grown or manufactured products.",
  difficulty: "easy - medium",
  link: "",
  schoolAge: "elementary",
  moreInfo: ""
});

taskRef.doc("public_transportation").set({
  title: "Use Public Transportation Instead of Driving",
  description: "Instead of Driving, use public transportation to reduce" +
  " carbon emission",
  difficulty: "easy",
  link: "",
  schoolAge: "elementary",
  moreInfo: ""
});

taskRef.doc("conserve_water").set({
  title: "Reduce Water Usage",
  description: "Reduce your water usage for a day",
  difficulty: "easy",
  link: "",
  schoolAge: "elementary",
  moreInfo: ""
});

taskRef.doc("conserve_water").set({
  title: "Change to LED Bulbs",
  description: "Use LED Bulbs instead of incadescent to reduce" +
  " electricity usage.",
  difficulty: "easy",
  link: "",
  schoolAge: "elementary",
  moreInfo: ""
});
