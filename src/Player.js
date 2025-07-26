export class Player {
  constructor(name) {
    this.name = name;
    this.dieIndex = null;
    this.roll = null;
  }

  chooseDie(index) {
    this.dieIndex = index;
  }

  setRoll(index) {
    this.roll = index;
  }

  getDieIndex() {
    return this.dieIndex;
  }

  getRoll() {
    return this.roll;
  }
}
