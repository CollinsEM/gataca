/**
   The gist of this experiment is to get some experience navigating a 1D
   data stream using one or more HTM columns. The specific example used
   here is navigating through the base pairs of some randomly generated
   snipet of DNA.
   
   At the very minimum, we should be able to implement a grid cell module
   for keeping track of position relative to certain specific features.
*/

window.addEventListener('load', init);
// The four letters of the DNA alphabet
let ACGT = ['A','C','G','T'];
// Length of the generated sequence
let seqLength = 60;
// Number of independent base-pair sensors
let numSensors = 3;
// Number of base-pairs sampled by each sensor
let sensorWidth = 5;
// Number of mini-columns in the temporal memory
let numMC = 4*sensorWidth+3;
// Number of cells per mini-column
let numCellsMC = 8;
// Starting index of our genomic sensor
let start = new Array(numSensors);
// Current sensor input
let input = new Array(numSensors);
// Handle to the DOM element displaying the sequence
var domSeq, domObs, domEnc, canvas, context;
var seqText;
var R=10, colSep = 3*R, rowSep = 3*R;
var colWidth = Math.max((sensorWidth*4+3), numMC)*colSep;
var agent;

function init() {
  // Get a handle to the DOM element
  domSeq = document.getElementById('sequence');
  domObs = document.getElementById('observation');
  domEnc = document.getElementById('obsEncoded');
  canvas = document.getElementById('canvas');
  canvas.width = 4*numSensors*(sensorWidth+1)*colSep;
  context = canvas.getContext('2d');
  // console.log(canvas.width, canvas.height);
  // console.log(colWidth, colSep, rowSep, R);
  // Fill the DOM element with a random sequence of base pairs
  seqText = "";
  for (let i=0; i<seqLength; ++i) {
    let seqSpan = document.createElement("span");
    let base = ACGT[Math.floor(Math.random()*4)];
    seqSpan.innerText = base;
    // seqSpan.style.color = "black";
    domSeq.appendChild(seqSpan);
    seqText += base;
  }
  console.log(seqText);
  
  let NI = sensorWidth*numSensors;
  for (let i=0; i<numSensors; ++i) {
    start[i] = i*Math.floor(seqLength/(numSensors+1));
    for (let j=0; j<sensorWidth; ++j) {
      let obsSpan = document.createElement("span");
      obsSpan.innerText = " ";
      obsSpan.style.color = "red";
      domObs.appendChild(obsSpan);
    }
  }
  // Initialize the agent
  agent = new Agent(numSensors, sensorWidth, numMC, numCellsMC);
  // Enter the main update loop
  update();
}

var numCycles = 0;
var numFrames = 0;
var framesPerCycle = 60;
function update() {
  requestAnimationFrame(update);
  // setTimeout(update, 250);
  
  if (numFrames == 0) {
    numCycles++;
    // Update the sensor locations
    let delta = [];
    for (let i=0; i<numSensors; ++i) {
      delta[i] = agent.COLS[i].getDelta();
      if (start[i]+delta[i] < 0) delta[i] = 0;
      if (start[i]+delta[i] > seqLength-sensorWidth) delta[i] = 0;
      start[i] += delta[i];
      // Extract the letters under the sensor
      input[i] = seqText.substring(start[i], start[i]+sensorWidth);
    }
    agent.encode(input, delta);
  }
  // Update the agent's internal state
  agent.update();
  // Render the current sequence
  render();
  // Update number of frames rendered for the current cycle
  numFrames = (numFrames + 1)%framesPerCycle;
}

function render() {
  // Reset the default styles on all of the base pairs
  for (let i=0; i<seqLength; ++i) {
    var c = 0;
    for (let j=0; j<numSensors; ++j) {
      if (i >= start[j] && i<start[j]+sensorWidth) c += 64;
    }
    domSeq.children[i].style.backgroundColor = rgb(c,c,c).hexify();
  }
  // Update the appearance of the letters under the sensor
  domEnc.innerHTML = "";
  for (let i=0; i<numSensors; ++i) {
    domEnc.innerHTML += "<p>" + agent.COLS[i].SP.toString() + "</p>";
  }
  // Render the internal state of the agent
  var x0 = (canvas.width - agent.width)/2;
  agent.render(x0, 0);
}

class RGB {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  hexify() {
    var r = this.r.toString(16);
    var g = this.g.toString(16);
    var b = this.b.toString(16);
    if (r.length < 2) r = '0' + r;
    if (g.length < 2) g = '0' + g;
    if (b.length < 2) b = '0' + b;
    return `#${r}${g}${b}`;
  }
};

function rgb(r,g,b) { return new RGB(r,g,b); }

function renderNode(x, y, fill, stroke) {
  context.beginPath();
  context.strokeStyle = (stroke.r === undefined ? stroke : stroke);
  context.fillStyle   = (fill.r   === undefined ? fill   : fill);
  context.arc(x, y, R, 0, 2*Math.PI, true);
  context.fill();
  context.stroke();
}
