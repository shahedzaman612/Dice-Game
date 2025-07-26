export class ProbabilityTablePrinter {
  static print(matrix) {
    const size = matrix.length;
    const header = ["", ...Array.from({ length: size }, (_, i) => `D${i}`)].join("\t");
    console.log("\n📊 Win Probability Matrix (%):");
    console.log(header);

    matrix.forEach((row, i) => {
      const line = row.map((val, j) => (i === j ? "  -" : `${val}%`)).join("\t");
      console.log(`D${i}\t${line}`);
    });
  }
}

