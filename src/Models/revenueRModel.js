const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const revenueSchema = new mongoose.Schema({
  userDetailsID: {
    type: ObjectId,
    ref: "Recruiters"
  },
  recruiterPlan: {
    type: String,
    required: true,
    enum: ["Gold", "Silver", "Platinum"]
  },
  jobPostno: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  start: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
},
{ timestamps: true });
module.exports =mongoose.model('RevenueR', revenueSchema);


