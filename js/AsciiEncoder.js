// ===================================================================
// ASCII ENCODER
// -------------------------------------------------------------------
// NOTE: Uses same encoding as ByteEncoder.
class AsciiEncoder {
  constructor() {
    this.char = '';
    this.ascii = 0;
    this.data = new Uint8Array(16);
    this.numBits = 16;
    this.numActive = 8;
    this.encode(0);
  }
  encode(c) {
    this.char  = String(c).charAt(0);
    this.ascii = String(c).charCodeAt(0);
    this.data.fill(0);
    var val = parseInt(this.ascii);
    for (var i=0; i<8; ++i) {
      this.data[2*i+0] = (val%2 == 1 ? 0 : 1);
      this.data[2*i+1] = (val%2 == 1 ? 1 : 0);
      val = parseInt(Math.floor(val/2));
    }
    return this.data;
  }
  print() {
    console.log(this.char, this.ascii);
    console.log(this.data);
  }
};

var ascii = new AsciiEncoder();
ascii.encode('A');
ascii.print();
ascii.encode('M');
ascii.print();
ascii.encode('Y');
ascii.print();
