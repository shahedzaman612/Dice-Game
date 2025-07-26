import { CryptoUtils } from "./CryptoUtils.js";

export class FairCommitment {
  constructor(range) {
    this.secretKey = CryptoUtils.randomBytes();
    this.computerNumber = CryptoUtils.secureRandomInt(range);
    this.hmac = CryptoUtils.hmacSha3(this.secretKey, this.computerNumber);
  }

  getCommitment() {
    return this.hmac;
  }

  reveal() {
    return {
      number: this.computerNumber,
      key: this.secretKey.toString("hex"),
      valid: CryptoUtils.hmacSha3(this.secretKey, this.computerNumber) === this.hmac
    };
  }

  resolve(userNumber, range) {
    return (userNumber + this.computerNumber) % range;
  }
}
