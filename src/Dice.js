export class Dice {
  constructor(faces) {
    this.faces = faces;
  }

  faceCount() {
    return this.faces.length;
  }

  roll(index) {
    return this.faces[index];
  }

  toString() {
    return `[${this.faces.join(", ")}]`;
  }

  getRandomFace() {
    const i = Math.floor(Math.random() * this.faceCount());
    return this.roll(i);
  }
}
