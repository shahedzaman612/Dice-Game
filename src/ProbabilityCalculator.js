export class ProbabilityCalculator {
  static computeMatrix(diceList, trials = 10000) {
    const n = diceList.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        let wins = 0;
        for (let t = 0; t < trials; t++) {
          const a = diceList[i].getRandomFace();
          const b = diceList[j].getRandomFace();
          if (a > b) wins++;
        }
        matrix[i][j] = (wins / trials * 100).toFixed(1);
      }
    }

    return matrix;
  }
}
