
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userprofileSchema = new mongoose.Schema(
  {
    userDetailsID: {
      type: ObjectId,
      ref: "user"
    },
    gitLink: {
      type: String,
      required: true
    },
    document: {
      key: { type: String },
      url: { type: String }
    },
    profileLink: {
      key: { type: String },
      url: { type: String }
    },
    gender: {
      type: String,
      required: true,
      enum: ["M", "F", "Not Prefer to Say"]
    },
    doB: {
      type: Date,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    aboutMe: {
      type: String,
      required: true
    },
    salary: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("userProfile", userprofileSchema);
