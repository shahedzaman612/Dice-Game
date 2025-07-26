import readline from "readline-sync";
import { FairCommitment } from "./FairCommitment.js";

export class FairRandomProtocol {
  static async perform(range, label = "your") {
    const commit = new FairCommitment(range);
    console.log(`\nI selected a random value in the range 0..${range - 1} (HMAC=${commit.getCommitment()})`);
    const userNum = readline.questionInt(`Add your number modulo ${range}: `, {
      limit: (input) => input >= 0 && input < range,
      limitMessage: "Invalid input."
    });

    const result = commit.resolve(userNum, range);
    const reveal = commit.reveal();

    console.log(`My number is ${reveal.number} (KEY=${reveal.key})`);
    console.log(`The fair number generation result is ${reveal.number} + ${userNum} = ${result} (mod ${range})`);
    return result;
  }
}
