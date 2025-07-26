import { Dice } from './Dice.js';

export class DiceParser {
  static parse(argv) {
    if (argv.length < 3) {
      throw new Error("❌ Must provide at least 3 dice. Example: node index.js 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7");
    }

    const dice = argv.map((arg, i) => {
      const values = arg.split(',').map(Number);
      if (values.length < 3) throw new Error(`❌ Die ${i + 1} must have at least 3 sides.`);
      if (values.some(isNaN)) {
        throw new Error(`❌ Die ${i + 1} contains non-numeric values.`);
      }
      return new Dice(values);
    });

    return dice;
  }
}
