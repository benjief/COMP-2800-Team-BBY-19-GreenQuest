


const taskRef = db.collection("task");

taskRef.doc("recycling").set({
  task: "recycle",
  link: "https://www.youtube.com/embed/6jQ7y_qQYUA",
  schoolAge: "middle",
  moreInfo: "https://www.youtube.com/embed/7UuUeoyYmxI"
});

taskRef.doc("walking").set({
  task: "walking",
  link: "https://www.youtube.com/embed/BWR3DxGHLD4",
  schoolAge: "elementary", 
  moreInfo: ""
});

taskRef.doc("plant_a_seed").set({
  task: "plant_a_seed",
  link: "https://www.youtube.com/embed/BWR3DxGHLD4",
  schoolAge: "middle",
  moreInfo: ""
});

taskRef.doc("plant_a_tree").set({
  task: "plant_a_tree",
  link: "https://www.youtube.com/embed/N7fIqlLB1eU",
  schoolAge: "middle",
  moreInfo: ""
});

taskRef.doc("turn_off_light").set({
  task: "turn_off_light",
  link: "https://www.youtube.com/embed/DfrHBy6YPj0",
  schoolAge: "elementary",
  moreInfo: ""
});

taskRef.doc("turn_off").set({
  task: "turn_off",
  link: "https://www.youtube.com/embed/6xJU5jZgnJI",
  schoolAge: "elementary",
  moreInfo: ""
});

