


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

