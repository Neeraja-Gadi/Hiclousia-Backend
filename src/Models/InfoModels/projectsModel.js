const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const projectsSchema = new mongoose.Schema(
    {
        userDetailsID: {
            type: ObjectId,
            ref: "user"
        },
        skills:{
            type: String,
            required: true
        },

        projectTitle: {
            type: String,
            required: true
        },
        startDate: {
            type: String,
           
        },
        endDate: {
            type: String,
            
        },
        organizationName: {
            type: String,
      
        },
        description:{
            type: String,
        },
        Url:{
            type:String,
        },
        isDeleted:{
            type: Boolean,
            Default: false
          },

    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Projects", projectsSchema);