const taskRef = db.collection("task");

taskRef.doc("recycling").set({
  taskName: "recycle",
  instruction: "https://www.youtube.com/embed/6jQ7y_qQYUA",
  schoolAge: "middle",
  moreInfo: "https://www.youtube.com/embed/7UuUeoyYmxI"
});

taskRef.doc("walking").set({
  taskName: "walking",
  instruction: "https://www.youtube.com/embed/BWR3DxGHLD4",
  schoolAge: "elementary", 
  moreInfo: ""
});

taskRef.doc("plant_a_seed").set({
  taskName: "plant_a_seed",
  instruction: "https://www.youtube.com/embed/BWR3DxGHLD4",
  schoolAge: "middle",
  moreInfo: ""
});

taskRef.doc("plant_a_tree").set({
  taskName: "plant_a_tree",
  instruction: "https://www.youtube.com/embed/N7fIqlLB1eU",
  schoolAge: "middle",
  moreInfo: ""
});

taskRef.doc("turn_off_light").set({
  taskName: "turn_off_light",
  instruction: "https://www.youtube.com/embed/DfrHBy6YPj0",
  schoolAge: "elementary",
  moreInfo: ""
});

taskRef.doc("turn_off").set({
  taskName: "turn_off",
  instruction: "https://www.youtube.com/embed/6xJU5jZgnJI",
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
