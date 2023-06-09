const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    recruiter: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted:{
      type: Boolean,
      Default: false
    },
    resetLink: {
      data: {
        type: String,
        default: ''
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);

