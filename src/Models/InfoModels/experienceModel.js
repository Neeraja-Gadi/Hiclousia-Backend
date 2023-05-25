const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const experienceSchema = new mongoose.Schema(
    {
        userDetailsID: {
            type: ObjectId,
            ref: "user"
        
        },
        jobStatus: {
            type: String,
            default: 'Active'
        },
        jobRole: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: true
        },
        companyType: {
            type: String
            // enum: ["MNC", "Start-Ups", "Government", "Service-Based", "Product-Based"]
        },
        location: {
            type: String,
            required: true
        },
        skills: {
            type: [String],
            required: true
        },
        experience: {
            type: String,
            required: true,
            trim: true
        },
        isDeleted:{
            type: Boolean,
            Default: false
          }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Experience", experienceSchema);
