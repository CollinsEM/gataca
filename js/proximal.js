//--------------------------------------------------------------------
// Proximal Synapses
//--------------------------------------------------------------------
var proximalLearnRate = 0.1;
var proximalConnectionThreshold = 0.5;
var proximalActivationThreshold = 1;
// Identify the source node on a proximal synapse
class ProximalSynapse {
  constructor(src) {
    this.src  = src;
    this.perm = Math.random();
  }
};
// Array of synapses on a proximal segment
