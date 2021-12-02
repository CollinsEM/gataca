// The four letters of the DNA alphabet
let INDEX = { 'A' : 0, 'C' : 1, 'G' : 2, 'T' : 3 } ;

class Column {
  constructor(SW, NMC, NPMC) {
    this.width  = Math.max((SW*4+4), NMC+1)*colSep;
    this.height = rowSep;
    this.spLen  = SW*4+3;
    this.SW     = SW;
    this.SP     = new Uint8Array(this.spLen);
    this.TM     = Array.from({length: NMC}, (v,i) => new MiniColumn(i, NPMC, SW*4+3));
  }
  // Generate a shift in the location of a sensor.  NOTE: For now this
  // is random, but eventually this should be directly generated from
  // the internal representation.
  getDelta() {
    return Math.floor(Math.random()*3) - 1;
  }
  update() {
    // Update the internal state
    this.TM.forEach(function(mc,idx,TM) {
      mc.updatePredictions(this.TM);
    }, this);
    this.TM.forEach(function(mc,idx,TM) {
      mc.updatePerms(this.SP, this.TM);
    }, this);
    this.TM.forEach(function(mc,idx,TM) {
      mc.updateActivations(this.SP);
    }, this);
  }
  // Encode new data
  encode(input, delta) {
    // console.log(input, delta);
    var itr = 0;
    for (let i=0; i<this.SW; ++i) {
      const c = input.charAt(i); // console.log(c);
      for (let k=0; k<4; ++k) {
        this.SP[itr++] = (INDEX[c] == k ? 1 : 0);
      }
    }
    for (let k=-1; k<2; ++k) {
      this.SP[itr++] = (delta == k ? 1 : 0);
    }
  }
  render(x0, y0) {
    // Render the spatial pooler
    let x1 = x0 + (this.width - colSep*this.SP.length)/2;
    let y1 = y0 + rowSep/2; // y coordinate
    context.clearRect(x0, y0, this.width, this.height);
    var stroke, fill;
    for (let i=0, x=x1+colSep/2; i<this.spLen; ++i, x+=colSep) {
      if (this.SP[i] > 0) {
        stroke = 'gray';
        fill = 'blue';
      }
      else {
        stroke = 'gray';
        fill = 'black';
      }
      renderNode(x, y1, fill, stroke);
    }
    // Render the temporal memory
    var x2 = x0 + (this.width - colSep*this.TM.length)/2;
    this.TM.forEach((v,i) => v.render(x2+i*colSep, 2*rowSep));
  }
};
