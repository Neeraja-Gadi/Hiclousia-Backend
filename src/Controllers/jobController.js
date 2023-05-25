const experienceModel = require("../Models/InfoModels/experienceModel");
const jobModel = require("../Models/jobModel");
const userprofileModel = require("../Models/userprofileModel");
const skillsModel = require("../Models/InfoModels/skillsModel");
const projectsModel = require("../Models/InfoModels/projectsModel");
const recruiterModel = require("../Models/recruiterModel");
const Joi = require('joi');

// ********************************************************************************************************************

const jobInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const recruiter = await recruiterModel.findById({ _id: id });
    if (!recruiter) {
      return res.status(400).send({ status: false, message: 'You are not authorized.' });
    }
    const { userDetailsID, jobRole, experience, primarySkills, secondarySkills, jobDescription, location, company, education, salary, sector } = req.body;
    const jobSchema = Joi.object({
      userDetailsID: Joi.string().required(),
      jobRole: Joi.string().required(),
      experience: Joi.string().required(),
      primarySkills: Joi.array().items(Joi.string().required()).required(),
      secondarySkills: Joi.array().items(Joi.string().required()).required(),
      jobDescription: Joi.string().allow(null, ''),
      salary: Joi.string().required(),
      location: Joi.string().required(),
      company: Joi.string().allow(null, ''),
      sector: Joi.string().allow(null, ''),
      education: Joi.array().items(
        Joi.object({
          authority: Joi.string().required(),
          educationLevel: Joi.string().required(),
          discipline: Joi.string().allow(null, ''),
        })
      ),
    });
    const validationResult = jobSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details.map(d => d.message) });
    }
    const data = await jobModel.create({
      userDetailsID,
      jobRole,
      experience,
      primarySkills,
      secondarySkills,
      jobDescription,
      location,
      company,
      education,
      salary,
      sector,
    });
    if (data) {
      return res.status(201).send({ status: true, data: data, message: 'Job-Post data created' });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ********************************************************************************************************************

const deleteJob = async function(req, res) {
  try {
    const id = req.params.id;
    const jobData = await projectsModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
    if (!jobData) {
      return res.status(404).send({ status: false, message: 'jobData data not found' });
    }
    res.status(200).json({ status: true, message: 'Job information deleted successfully' });
} catch (err) {
    res.status(500).json({ status: false, message: err.message });
}
};

// ********************************************************************************************************************

const updateJobData = async function(req, res){
  try {
      const jobSchema = Joi.object({

          userDetailsID: Joi.string(),
          jobRole: Joi.string(),
          experience: Joi.string(),
          primarySkills: Joi.string(),
          secondarySkills: Joi.string(),
          jobDiscription: Joi.string(),
          salary: Joi.string(),
          location: Joi.string(),
          company: Joi.string(),
          education: Joi.array().items(
            Joi.object({
                authority: Joi.string().required(),
                educationLevel: Joi.string().required(),
                discipline: Joi.string().required(),
            })
        ).required(),
          sector: Joi.string(),
      });
      const validationResult = jobSchema.validate(req.body, { abortEarly: false });
      if (validationResult.error) {
          return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
      };
      const id  = req.params.id;
          let jobData = {};
          jobData=  await jobModel.findById({_id: id});
          if (!jobData) {
              return res.status(404).send({ status: false, message: 'Job data not found' });
          }
   // if (req.method === 'PUT') {
          jobData.userDetailsID = req.body.userDetailsID;
          jobData.primarySkills = req.body.primarySkills;
          jobData.secondarySkills = req.body.secondarySkills;
          jobData.jobDiscription = req.body.jobDiscription;
          jobData.salary = req.body.salary;
          jobData.location = req.body.locajotion;
          jobData.company = req.body.company;
          jobData.education= req.body.education;
          jobData.sector= req.body.sector;
          jobData.experience=req.body.experience;
          jobData.jobRole=req.body.jobRole;



      const updatedData = await jobModel.findByIdAndUpdate({_id: id}, jobData, {new:true});
      return res.status(200).send({ status: true, data: updatedData, message: 'Job data updated' });
      // 
  } catch (err) {
  return res.status(500).send({ status: false, message: err.message })
}
};

// ********************************************************************************************************************

const searchJobs = async (req, res) => {
  try {
    const {
      jobRole,
      experience,
      primarySkills,
      secondarySkills,
      jobDescription,
      education,
      company,
      location,
      discipline
    } = req.query;

    const query = {};

    if (jobRole) {
      const jobRoleArray = jobRole.split(",");
      query.jobRole = {$in: jobRoleArray.map(jobRole => new RegExp(jobRole.trim(), 'i')) };
    }
    if (experience) {
      const experienceArray = experience.split(",");
      query.experience = {$in: experienceArray.map(experience => new RegExp(experience.trim(), 'i')) };
    }

    if (primarySkills) {
      const skillsArray = primarySkills.split(",");
      query.primarySkills = { $in: skillsArray.map(skill => new RegExp(skill.trim(), 'i')) };
    }

    if (secondarySkills) {
      const skillsArray = secondarySkills.split(",");
      query.secondarySkills = { $in: skillsArray.map(skill => new RegExp(skill.trim(), 'i')) };
    }

    if (jobDescription) {
      query.jobDescription = { $regex: jobDescription, $options: 'i' };
    }

    if (education) {
      query.education.educationLevel = { $regex: education, $options: 'i' };
    }

    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (discipline) {
      query.discipline = { $regex: discipline, $options: 'i' };
    }

    const jobs = await jobModel.find({ $or: [ query ] }).populate('userDetailsID', 'fullName email phoneNumber');
    res.json({
      status: true,
      data: jobs
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

//****************count all recruiter with jobpost and show details of jobpost with a recruiter information and also all recruiters */
// const jobpostbyRecruiter = async function(req, res) {
//   try {
//     const id = req.params.id;
//     const jobData = await jobModel.find({ userDetailsID: id }).populate('userDetailsID', 'fullName email phoneNumber');
//     if (!jobData) {
//       return res.status(404).send({ status: false, message: 'Job data not found' });
//     }
//     const recruiterCounts = await jobModel.aggregate([
//       {
//         $match: {
//           userDetailsID: { $exists: true },
//         },
//       },
//       {
//         $group: {
//           _id: "$userDetailsID",
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $lookup: {
//           from: "recruiters",
//           localField: "_id",
//           foreignField: "_id",
//           as: "recruiter",
//         },
//       },
//       {
//         $project: {
//           recruiterName: { $arrayElemAt: ["$recruiter.fullName", 0] },
//           recruiterEmail: { $arrayElemAt: ["$recruiter.email", 0] },
//           recruiterPhone: { $arrayElemAt: ["$recruiter.phoneNumber", 0] },
//           count: 1,
//         },
//       },
//     ]);

//     res.status(200).json({ status: true, data: jobData, recruiterCounts });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// }

//******************count recruiter with jobpost and show details of jobpost with a recruiter information */
const jobpostbyRecruiter = async function(req, res) {
  try {
    const id = req.params.id;
    const jobData = await jobModel.find({ userDetailsID: id }).populate('userDetailsID', 'fullName email phoneNumber');
    if (!jobData) {
      return res.status(404).send({ status: false, message: 'jobData not found' });
    }
    
    const recruiters = await jobModel.aggregate([
      { $match: { userDetailsID: { $exists: true } } },
      { $group: { _id: '$userDetailsID', count: { $sum: 1 } } }
    ]);

    const jobDataWithCount = jobData.map(job => {
      const recruiter = recruiters.find(recruiter => recruiter._id.toString() === job.userDetailsID._id.toString());
      return {
        ...job._doc,
        count: recruiter ? recruiter.count : 0
      };
    });

    res.status(200).json({ status: true, data: jobDataWithCount });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
}


module.exports = {jobpostbyRecruiter, jobInfo, searchJobs, updateJobData, deleteJob };


