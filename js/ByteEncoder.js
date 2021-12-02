// ===================================================================
// BYTE ENCODER
// -------------------------------------------------------------------
// Allocates two bins for each bit in the binary representation.  If
// the corresponding bit is 0, then the first of the two bins is set
// to 1.  If the bit is 1, then the second of the two bins is set to
// 1.
class ByteEncoder {
  constructor() {
    this.value = 0;
    this.data = new Uint8Array(16);
    this.encode(0);
  }
  encode(val) {
    this.value = Math.max(0,Math.min(255,parseInt(val)));
    this.data.fill(0);
    for (var i=0; i<8; ++i) {
      this.data[2*i+0] = (val%2 == 1 ? 0 : 1);
      this.data[2*i+1] = (val%2 == 1 ? 1 : 0);
      val = parseInt(val/2);
    }
  }
  print() {
    console.log(this.value);
    console.log(this.data);
  }
};

// var byte = new ByteEncoder();
// byte.encode(String('A').charCodeAt(0));
// byte.print();
// byte.encode(255);
// byte.print();
// byte.encode(128);
// byte.print();

