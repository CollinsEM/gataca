class Agent {
  constructor(NS, SW, NMC, NCMC) {
    this.NS = NS; // Number of independent sensors. Also number of columns, (i.e. 1 sensor per column)
    this.SW = SW; // Number of base-pairs read per sensor
    this.NMC = NMC; // Number of TM mini-columns
    this.NCMC = NCMC; // Number of cells per mini-column
    this.COLS = Array.from({length: NS}, (v,i) => new Column(SW, NMC, NCMC));
    this.colWidth = this.COLS[0].width;
    this.width = NS*this.colWidth;
  }
  // Update the internal state
  update() {
    // Encode the input base-pairs read from each sensor
    this.COLS.forEach((v,i) => v.update());
  }
  encode(input, delta) {
    this.COLS.forEach((v,i) => v.encode(input[i], delta[i]));
  }
  render(x0, y0) {
    // var h = (this.NCMC + 2)*rowSep;
    this.COLS.forEach((v,i) => v.render(x0 + i*this.colWidth, 0));
  }
};
