const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const planRSchema = new Schema({
  userDetailsID: {
    type: ObjectId,
    ref: "Recruiters"
  },
  plan: {
    type: String,
    required: true,
    enum: ["Gold", "Silver", "Platinum"]
  },
  numberOfJobPost: {
    type: String,
    required: true,
    enum: ["1", "3", "10"]
  },
  duration: {
    type: Number,
    comment:"Duration in Days"
  },
  start: {
    type: Date,
    default: Date.now
  },
  skillsAnalytics: {
    type : Boolean,
    default: true,
  },
  workEvidence: {
    type : Boolean,
    default: false,
  },
  verifiedProfiles: {
    type : Boolean,
    default: false,
  },
  directEngagement: {
    type : Boolean,
    default: true,
  },
  scheduleInterview: {
    type : Boolean,
    default: true,
  },
  conductAssessment: {
    type : Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
},
  { timestamps: true },
);

const RecruiterPlan = mongoose.model('Recruiters', planRSchema);
module.exports = RecruiterPlan;
