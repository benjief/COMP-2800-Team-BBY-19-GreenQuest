'use strict'

class Task {
  constructor(title, description, instruction, moreInfo) {
    this.title = title;
    this.description = description;
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
          instruction: task.instruction,
          moreInfo: task.moreInfo
      };
  },
  fromFirestore: function(snapshot, options){
      const data = snapshot.data(options);
      return new Task(data.title, data.description, data.instruction, data.moreInfo);
  }
};

