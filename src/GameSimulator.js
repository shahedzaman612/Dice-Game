import readline from "readline-sync";
import { Player } from "./Player.js";
import { FairRandomProtocol } from "./FairRandomProtocol.js";
import { ProbabilityCalculator } from "./ProbabilityCalculator.js";
import { ProbabilityTablePrinter } from "./ProbabilityTablePrinter.js";
import { FairCommitment } from "./FairCommitment.js";

export class GameSimulator {
  constructor(diceSet) {
    this.diceSet = diceSet;
    this.user = new Player("User");
    this.computer = new Player("Computer");
  }

  async fairFirstMove() {
    console.log("Let's determine who picks first.");
    const commit = new FairCommitment(2);
    console.log(`I selected a number in 0..1 (HMAC=${commit.getCommitment()})`);
    let guess = readline.question("Try to guess my selection (0 or 1): ");
    if (guess === "X") process.exit();
    const result = commit.resolve(parseInt(guess), 2);
    const reveal = commit.reveal();
    console.log(`My selection: ${reveal.number} (KEY=${reveal.key})`);
    return reveal.number === parseInt(guess);
  }

  async start() {
    console.log("🎲 Welcome to the Non-Transitive Dice Game");
    const userGoesFirst = await this.fairFirstMove();

    if (userGoesFirst) {
      console.log("You go first. Choose your die:");
      this.diceSet.printAll();
      const userChoice = parseInt(readline.question("Your selection: "));
      this.user.chooseDie(userChoice);

      console.log("Computer selects a different die...");
      let compChoice;
      do {
        compChoice = Math.floor(Math.random() * this.diceSet.count());
      } while (compChoice === userChoice);
      this.computer.chooseDie(compChoice);
    } else {
      console.log("I go first.");
      const compChoice = Math.floor(Math.random() * this.diceSet.count());
      this.computer.chooseDie(compChoice);
      console.log(`I choose die: ${this.diceSet.get(compChoice).toString()}`);

      console.log("Your turn. Choose a different die:");
      this.diceSet.printAll(compChoice);
      const userChoice = parseInt(readline.question("Your selection: "));
      this.user.chooseDie(userChoice);
    }

    const userDie = this.diceSet.get(this.user.getDieIndex());
    const compDie = this.diceSet.get(this.computer.getDieIndex());

    console.log("\n--- Computer's Roll ---");
    const compIndex = await FairRandomProtocol.perform(compDie.faceCount(), "computer");
    const compRoll = compDie.roll(compIndex);
    console.log(`Computer's face: ${compRoll}`);

    console.log("\n--- Your Roll ---");
    const userIndex = await FairRandomProtocol.perform(userDie.faceCount(), "your");
    const userRoll = userDie.roll(userIndex);
    console.log(`Your face: ${userRoll}`);

    if (userRoll > compRoll) console.log("✅ You win!");
    else if (userRoll < compRoll) console.log("💻 Computer wins!");
    else console.log("🤝 It's a tie!");
  }
}

