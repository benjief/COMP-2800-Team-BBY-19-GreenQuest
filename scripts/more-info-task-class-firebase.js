'use strict'

class Task {
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

  getDescription() {
    return this.description;
  }
}

// Firestore data converter
var taskConverter = {
  toFirestore: function(task) {
      return {
          title: task.title,
          description: task.description,
          difficulty: task.difficulty,
          instruction: task.instruction,
          moreInfo: task.moreInfo
      };
  },
  fromFirestore: function(snapshot, options){
      const data = snapshot.data(options);
      return new Task(data.title, data.description, data.difficulty, data.instruction, data.moreInfo);
  }
};
