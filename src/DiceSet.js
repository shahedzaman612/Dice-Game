export class DiceSet {
  constructor(diceList) {
    this.dice = diceList;
  }

  count() {
    return this.dice.length;
  }

  get(index) {
    return this.dice[index];
  }

  all() {
    return this.dice;
  }

  printAll(skipIndex = null) {
    this.dice.forEach((d, i) => {
      if (i !== skipIndex) {
        console.log(`${i} - ${d.toString()}`);
      }
    });
  }
}
