const mongoose = require('mongoose');
const ConstructionCost=require('./ConstructionCost');
const Schema = mongoose.Schema;

const earthworkSchema = new Schema({
  length: { type: Number, default: 0 },
  breadth: { type: Number, default: 0 },
  depth: { type: Number, default: 0 },
  totalvalue: { type: Number, default: 0 }
});

const bedConcreteSchema = new Schema({
  length: { type: Number, default: 0 },
  breadth: { type: Number, default: 0 },
  depth: { type: Number, default: 0 },
  totalvalue: { type: Number, default: 0 }
});

const rrmansorySchema = new Schema({
  length: { type: Number, default: 0 },
  breadth: { type: Number, default: 0 },
  depth: { type: Number, default: 0 },
  totalvalue: { type: Number, default: 0 }
});

const ssMansorySchema = new Schema({
  length: { type: Number, default: 0 },
  breadth: { type: Number, default: 0 },
  depth: { type: Number, default: 0 },
  totalvalue: { type: Number, default: 0 }
});

const dpcSchema = new Schema({
  length: { type: Number, default: 0 },
  breadth: { type: Number, default: 0 },
  depth: { type: Number, default: 0 },
  totalvalue: { type: Number, default: 0 }
});

const projectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  projectname: { type: String, required: true },
  createddate: { type: Date, default: Date.now, required: true }, 
  clientname: { type: String, required: true },
  clientaddress: { type: String, required: true },
  clientcontact: { type: String, required: true },
  works: {
    foundation: {
      earthwork: earthworkSchema,
      bedconcrete: bedConcreteSchema,
      rrmansory: rrmansorySchema,
      ssMansory: ssMansorySchema,
      dpc: dpcSchema
    }
  }
},{ timestamps: true });

projectSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      // Fetch ConstructionCost for the user
      const constructionCost = await ConstructionCost.findOne({ user: this.userId });
      if (constructionCost) {
        // Initialize nested objects if undefined
        this.works = this.works || {};
        this.works.foundation = this.works.foundation || {};
        this.works.foundation.earthwork = this.works.foundation.earthwork || {};
        this.works.foundation.bedconcrete = this.works.foundation.bedconcrete || {};
        this.works.foundation.rrmansory = this.works.foundation.rrmansory || {};
        this.works.foundation.ssMansory = this.works.foundation.ssMansory || {};
        this.works.foundation.dpc = this.works.foundation.dpc || {};

        // Set default values from ConstructionCost
        this.works.foundation.earthwork.totalvalue = constructionCost.foundation.earthWork;
        this.works.foundation.bedconcrete.totalvalue = constructionCost.foundation.bedConcrete;
        this.works.foundation.rrmansory.totalvalue = constructionCost.foundation.rrMasonry;
        this.works.foundation.ssMansory.totalvalue = constructionCost.foundation.ssMasonry;
        this.works.foundation.dpc.totalvalue = constructionCost.foundation.dpc;
      }
    }
    next();
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
