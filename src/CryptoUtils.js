import crypto from "crypto";

export class CryptoUtils {
  static randomBytes(bits = 256) {
    return crypto.randomBytes(bits / 8);
  }

  static hmacSha3(key, message) {
    return crypto
      .createHmac("sha3-256", key)
      .update(Buffer.from([message]))
      .digest("hex");
  }

  static secureRandomInt(range) {
    if (range <= 0) throw new Error("Range must be positive.");
    return crypto.randomInt(range);
  }
}
