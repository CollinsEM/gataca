class IntegerEncoder {
  constructor(numPrimes) {
    this.numPrimes = numPrimes;
    // Generate N prime to server as a basis set
    this.primes = [2];
    for (var i=3; this.primes.length < numPrimes; ++i) {
      if (this.primes.reduce((a,b) => a && (i%b), true)) this.primes.push(i);
    }
    this.numBits = this.primes.reduce((a,b) => a+b, 0);
    this.numReps = this.primes.reduce((a,b) => a*b, 1);
    this.sparsity = this.numPrimes/this.numBits;
    this.data = new Uint8Array(this.numBits);
    this.data.fill(0);
  }
  encode(num) {
    var N = parseInt(num);
    this.data.fill(0);
    var idx = 0;
    this.primes.forEach( function(p) {
      this.data[idx + N%p] = 1;
      idx += p;
    }, this );
  }
};

if (module !== undefined) {
  console.log("16 bit: ", parseInt(Math.pow(2,16)));
  console.log("32 bit: ", parseInt(Math.pow(2,32)));
  console.log("64 bit: ", parseInt(Math.pow(2,64)));
  for (var n=1; n<10; ++n) {
    var S = new IntegerEncoder(n);
    console.log("primes:   " + S.primes);
    console.log("numBits:  " + S.numBits);
    console.log("numReps:  " + S.numReps);
    console.log("sparsity: " + S.sparsity);
    var N = parseInt(S.numReps*Math.random());
    S.encode(N);
    console.log(N, S.data.join(''));
  }
}
