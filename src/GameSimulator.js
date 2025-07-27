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

    let guess;
    while (true) {
      const input = readline
        .question("Try to guess my selection (0 or 1, X to exit): ")
        .trim()
        .toUpperCase();
      if (input === "X") process.exit();
      if (input === "0" || input === "1") {
        guess = parseInt(input);
        break;
      }
      console.log("Invalid input. Please enter 0 or 1.");
    }

    const result = commit.resolve(guess, 2);
    const reveal = commit.reveal();
    console.log(`My selection: ${reveal.number} (KEY=${reveal.key})`);
    return reveal.number === guess;
  }

  async start() {
    console.log("🎲 Welcome to the Non-Transitive Dice Game");
    const userGoesFirst = await this.fairFirstMove();

    if (userGoesFirst) {
      console.log("You go first. Choose your die:");
      this.diceSet.printAll();

      let userChoice;
      while (true) {
        const input = readline
          .question("Your selection (or ? for help, X to exit): ")
          .trim()
          .toUpperCase();
        if (input === "X") process.exit();
        if (input === "?") {
          const matrix = ProbabilityCalculator.computeMatrix(
            this.diceSet.all()
          );
          ProbabilityTablePrinter.print(matrix);
          continue;
        }

        const index = parseInt(input);
        if (!isNaN(index) && index >= 0 && index < this.diceSet.count()) {
          userChoice = index;
          break;
        }

        console.log("❌ Invalid choice. Please try again.");
      }

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

      let userChoice;
      while (true) {
        const input = readline
          .question("Your selection (or ? for help, X to exit): ")
          .trim()
          .toUpperCase();
        if (input === "X") process.exit();
        if (input === "?") {
          const matrix = ProbabilityCalculator.computeMatrix(
            this.diceSet.all()
          );
          ProbabilityTablePrinter.print(matrix);
          continue;
        }

        const index = parseInt(input);
        if (
          !isNaN(index) &&
          index >= 0 &&
          index < this.diceSet.count() &&
          index !== compChoice
        ) {
          userChoice = index;
          break;
        }

        console.log("❌ Invalid choice. Must be a different die. Try again.");
      }

      this.user.chooseDie(userChoice);
    }

    const userDie = this.diceSet.get(this.user.getDieIndex());
    const compDie = this.diceSet.get(this.computer.getDieIndex());

    console.log("\n--- Computer's Roll ---");
    const compIndex = await FairRandomProtocol.perform(
      compDie.faceCount(),
      "computer"
    );
    const compRoll = compDie.roll(compIndex);
    console.log(`Computer's face: ${compRoll}`);

    console.log("\n--- Your Roll ---");
    const userIndex = await FairRandomProtocol.perform(
      userDie.faceCount(),
      "your"
    );
    const userRoll = userDie.roll(userIndex);
    console.log(`Your face: ${userRoll}`);

    if (userRoll > compRoll) console.log("✅ You win!");
    else if (userRoll < compRoll) console.log("💻 Computer wins!");
    else console.log("🤝 It's a tie!");
  }
}
