
const mongoose = require ("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const jobSchema = new mongoose.Schema(
  {
    userDetailsID:{
      type: ObjectId,
      ref: "Recruiters"
    },
    jobRole: {
      type: [String],
      required: true,
    },
    experience:{
      type: [String],
      required: true,
    },
    primarySkills: {
      type: [String],
      required: true,
    },
    secondarySkills: {
      type: [String],
      required: true,
    },
    sector:{
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      // required: true
    },
    salary: {
      type: String,
      required: true
    },
    education: [//capitalize E for the searchJOB FUNCTION
      {
      authority: {//not included
        type: String,
        required: true,
      },
      educationLevel: {
        type: String,
        required: true,
      },
      discipline: { //not included
        type: String,
        required: true
      }
    }
    ],
    company: {
      type: String,
      // required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isDeleted:{
      type: Boolean,
      Default: false
    },
    isExpired:{
      type: Boolean,
      Default: false
    },
    isField:{
      type: Boolean,
      Default: false
    },
  },

  { timestamps: true }
);
module.exports = mongoose.model("Job", jobSchema); 
