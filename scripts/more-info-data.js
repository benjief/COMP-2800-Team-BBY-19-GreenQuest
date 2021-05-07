const taskRef = db.collection("instructions");

taskRef.doc("recycling").set({
  task: "recycling",
  link: "https://www.youtube.com/watch?v=6jQ7y_qQYUA&t=2s",
  schoolAge: "middle"
});

taskRef.doc("walking").set({
  task: "walking",
  link: "https://www.youtube.com/watch?v=BWR3DxGHLD4",
  schoolAge: "elementary"
});

taskRef.doc("plant_a_seed").set({
  task: "plant_a_seed",
  link: "https://www.youtube.com/watch?v=BWR3DxGHLD4",
  schoolAge: "middle"
});

taskRef.doc("plant_a_tree").set({
  task: "plant_a_tree",
  link: "https://www.youtube.com/watch?v=N7fIqlLB1eU",
  schoolAge: "middle"
});

taskRef.doc("turn_off_light").set({
  task: "turn_off_light",
  link: "https://www.youtube.com/watch?v=DfrHBy6YPj0",
  schoolAge: "elementary"
});

taskRef.doc("turn_off").set({
  task: "turn_off",
  link: "https://www.youtube.com/watch?v=6xJU5jZgnJI",
  schoolAge: "elementary"
});

// saved//

