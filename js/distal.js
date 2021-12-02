//--------------------------------------------------------------------
// Distal Synapses
//--------------------------------------------------------------------
var distalSynapseLearnRate = 0.1;
var distalSynapseConnectionThreshold = 0.5;
var distalSynapseActivationThreshold = 2;
// Identify the source node on a distal synapse
class DistalSynapse {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.perm = Math.random();
  }
  updatePerm(sig) {
    this.perm += sig*distalSynapseLearnRate;
  }
};
//--------------------------------------------------------------------
// Distal Segments
//--------------------------------------------------------------------
var distalSegmentActivationThreshold = 5;
// Array of source nodes on a distal segment
class DistalSegment {
  constructor() {
    this.synapses = [];
    this.active = [];
    this.boost = 1.0;
  }
  integrate(TM) {
    // Filter for connected synapses (i.e. permenances large enough to
    // be considered connected)
    var connected = this.synapses.filter(syn => syn.perm > distalSynapseConnectionThreshold);
    // Filter for connected synapses that were active in the last
    // iteration.
    this.active = connected.filter(syn => TM[syn.col].activation[syn.row] > 0);
    this.activation = this.active.reduce( (sum,syn) => sum + 1, 0 );
    return this.activation;
  }
  updatePerm(sig) {
    this.active.forEach( (syn,idx) => syn.updatePerm(sig) );
  }
};

