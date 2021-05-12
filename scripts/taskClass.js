'use strict'

//maybe I can create a class

class Task {
  constructor(taskName, description) {
    this.taskName = taskName;
    this.description = description;
    this.instruction = "";
    this.moreInfo = "";
  }

  get taskName() {
    return this.taskName;
  }
  get description() {
    return this.description;
  }
  get instruction() {
    return this.instruction;
  }
  get moreInfo() {
    return this.moreInfo;
  }

  set instruction(instruction) {
    this.instruction = instruction;
    //task in firebase? 
    //actual saving is done on firebase
  }
}


class fireBaseTask extends Task {
  
  constructor(taskName, description, collectionInfo) {
    super(taskName, description);
    this.collectionInfo = collectionInfo;
  }

  get taskName() {
    
  }

}