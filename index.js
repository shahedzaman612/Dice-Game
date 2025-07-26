import { DiceParser } from './src/DiceParser.js';
import { DiceSet } from './src/DiceSet.js';
import { GameSimulator } from './src/GameSimulator.js';

const args = process.argv.slice(2);

try {
  const dice = DiceParser.parse(args);
  const diceSet = new DiceSet(dice);
  const simulator = new GameSimulator(diceSet);
  await simulator.start();
} catch (err) {
  console.error("❌ Error:", err.message);
}