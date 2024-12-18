const mongoose = require('mongoose');

const ConstructionCostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User collection
  foundation: {
    earthWork: { type: Number, default: 0 },
    bedConcrete: { type: Number, default: 0 },
    rrMasonry: { type: Number, default: 0 },
    ssMasonry: { type: Number, default: 0 },
    dpc: { type: Number, default: 0 },
  },
  painting: {
    interiorWall: { type: Number, default: 0 },
    exteriorWall: { type: Number, default: 0 },
    oilPaint: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('ConstructionCost', ConstructionCostSchema);
