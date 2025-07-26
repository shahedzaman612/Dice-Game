import crypto from "crypto";

export class CryptoUtils {
  static randomBytes(bits = 256) {
    return crypto.randomBytes(bits / 8);
  }

  static hmacSha3(key, message) {
    return crypto.createHmac("sha3-256", key).update(Buffer.from([message])).digest("hex");
  }

  static secureRandomInt(range) {
    while (true) {
      const val = crypto.randomBytes(1)[0];
      if (val < Math.floor(256 / range) * range) {
        return val % range;
      }
    }
  }
}
