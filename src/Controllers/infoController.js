const educationModel = require("../Models/InfoModels/educationModel.js");
const experienceModel = require("../Models/InfoModels/experienceModel.js");
const projectsModel = require("../Models/InfoModels/projectsModel.js");
const userprofileModel = require("../Models/userprofileModel");
const skillsModel = require("../Models/InfoModels/skillsModel.js")
const userModel = require("../Models/userModel.js")
const Joi = require('joi');

// ********************************************************************************************************************

const educationInfo = async function (req, res) {
    try {     

        const educationSchema = Joi.object({
            userDetailsID: Joi.string().required(),
            educationLevel: Joi.string().required(),
            collegeName: Joi.string().required(),
            authority: Joi.string().required(),
            discipline: Joi.string().required(),
            yearOfpassout: Joi.string().required(),
        });

        const validationResult = educationSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
        };

        // Create new education data
        const data = await educationModel.create(req.body);
        if (data)
            return res.status(200).send({ status: true, data: data, message: 'Education data created' });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

// ********************************************************************************************************************

const updateEducationData = async function (req, res) {
    try {
        
        const educationSchema = Joi.object({
            userDetailsID: Joi.string(),
            educationLevel: Joi.string(),
            collegeName: Joi.string(),
            authority: Joi.string(),
            discipline: Joi.string(),
            yearOfpassout: Joi.string()
        });
        const validationResult = educationSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
        };
        const id = req.params.id;
        let educationData = {};
        educationData = await educationModel.findById({ _id: id });
        if (!educationData) {
            return res.status(404).send({ status: false, message: 'Education data not found' });
        }
        // if (req.method === 'PUT') {
        // Update education data
        educationData.userDetailsID = req.body.userDetailsID;
        educationData.educationLevel = req.body.educationLevel;
        educationData.collegeName = req.body.collegeName;
        educationData.authority = req.body.authority;
        educationData.discipline = req.body.discipline;
        educationData.yearOfpassout = req.body.yearOfpassout;

        const updatedData = await educationModel.findByIdAndUpdate({ _id: id }, educationData, { new: true });
        return res.status(200).send({ status: true, data: updatedData, message: 'Education data updated' });
        // 
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

// ********************************************************************************************************************

const experienceInfo = async function (req, res) {
    try {
        const experienceSchema = Joi.object({
            userDetailsID: Joi.string().required(),
            jobStatus: Joi.string(),
            jobRole: Joi.string().required(),
            companyName: Joi.string().required(),
            companyType: Joi.string(),
            location: Joi.string().required(),
            skills: Joi.string().required(),
            experience: Joi.string().required(),


        });
        const validationResult = experienceSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
        };
        const data = await experienceModel.create(req.body);
        if (data)
            return res.status(200).send({ status: true, data: data, message: 'Experience data created' })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

};

// ********************************************************************************************************************

const updateExperienceData = async function (req, res) {
    try {
        const { userDetailsID, jobStatus, jobTitle, experience, companyName, companyType, location, skills} = req.body;
        const experienceSchema = Joi.object({
            userDetailsID: Joi.string(),
            jobStatus: Joi.string(),
            jobRole: Joi.string(),
            companyName: Joi.string(),
            companyType: Joi.string(),
            location: Joi.string(),
            skills: Joi.string(),
            experience: Joi.string()
        });
        const validationResult = experienceSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
        };
        const id = req.params.id;
        let experienceData = {};
        experienceData = await experienceModel.findById({ _id: id });
        if (!experienceData) {
            return res.status(404).send({ status: false, message: 'Experience data not found' });
        }
        // Update experience data
        experienceData.userDetailsID = req.body.userDetailsID;
        experienceData.jobStatus = req.body.jobStatus;
        experienceData.jobRole = req.body.jobRole;
        experienceData.companyName = req.body.companyName;
        experienceData.companyType = req.body.companyType;
        experienceData.location = req.body.location;
        experienceData.skills = req.body.skills;
        experienceData.experience = req.body.experience;

        const updatedData = await experienceModel.findByIdAndUpdate({ _id: id }, experienceData, { new: true });
        return res.status(200).send({ status: true, data: updatedData, message: 'Experience data updated' });
        // 
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

// ********************************************************************************************************************

const projectInfo = async function (req, res) {
    try {
        const projectSchema = Joi.object({

            userDetailsID: Joi.string().required(),
            projectTitle: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            organizationName: Joi.string().required(),
            description: Joi.string().required(),
            Url: Joi.string().required(),
        });
        const validationResult = projectSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
        };
        const data = await projectsModel.create(req.body);
        if (data)
            return res.status(200).send({ status: true, data: data, message: 'Project data created' });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

// ********************************************************************************************************************

const skillsInfo = async function (req, res) {
    try {
        const skillsSchema = Joi.object({
            userDetailsID: Joi.string().required(),
            primarySkills:Joi.array().items(Joi.string()).required(),
            secondarySkills: Joi.array().items(Joi.string()).required(),
        });
        const validationResult = skillsSchema.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
        };
        const data = await skillsModel.create(req.body);
        if (data)
            return res.status(200).send({ status: true, data: data, message: 'Skills data created' });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

// ********************************************************************************************************************

const updateSkillsData = async function (req, res) {
  try {
    const skillsSchema = Joi.object({
      userDetailsID: Joi.string(),
      primarySkills: Joi.array().items(Joi.string()),
      secondarySkills: Joi.array().items(Joi.string()),
    });
    const validationResult = skillsSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res
        .status(400)
        .send({ status: false, message: validationResult.error.details[0].message });
    }

    const userID = req.params.id;
    let skillData = await skillsModel.findOne({ userDetailsID: userID});
    if (!skillData) {
      return res.status(404).send({ status: false, message: "Skill data not found" });
    }

    if (req.body.primarySkills) {
      req.body.primarySkills.forEach((skill) => {
        if (!skillData.primarySkills.includes(skill)) {
          skillData.primarySkills.push(skill);
        }
      });
    }

    if (req.body.secondarySkills) {
      req.body.secondarySkills.forEach((skill) => {
        if (!skillData.secondarySkills.includes(skill)) {
          skillData.secondarySkills.push(skill);
        }
      });
    }

    const updatedData = await skillsModel.findByIdAndUpdate(
      { _id: skillData._id },
      skillData,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updatedData, message: "Skill data updated" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ********************************************************************************************************************

const personalInfo = async function (req, res) {
    try {

        const id = req.params.id

        const user = await userModel.find({ _id: id })
        const educationData = await educationModel.find({ userDetailsID: id })
        const experienceData = await experienceModel.find({ userDetailsID: id })
        const skills = await skillsModel.find({ userDetailsID: id })
        const userprofile = await userprofileModel.find({ userDetailsID: id })
        const projects = await projectsModel.find({ userDetailsID: id })

        const data = { user, educationData, experienceData, skills, userprofile, projects}
        if (!data) {
            return res.status(404).send({ status: false, message: 'Personal Data data not found' });
          }
        return res.status(200).send({ status: true, data: data })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

// ********************************************************************************************************************

// GET education data by user ID
const educationInformation = async function(req, res) {
    try {
        const id = req.params.id;
        const educationData = await educationModel.findById({ _id: id });
        if (!educationData) {
            return res.status(404).send({ status: false, message: 'educationData data not found' });
          }
        res.status(200).json({ status: true, data: educationData });
    }

    catch (err) 
    {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ********************************************************************************************************************

const deleteEducation = async function(req, res) {
    try {
        const id = req.params.id;
        const educationData = await projectsModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
        if (!educationData) {
            return res.status(404).send({ status: false, message: 'educationData data not found' });
          }
        res.status(200).json({ status: true, message: 'Education information deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ********************************************************************************************************************

const experienceInformation = async function(req, res) {
    try {
        const id = req.params.id;
        const experienceData = await experienceModel.findOne({ _id: id });
        if (!experienceData) {
            return res.status(404).send({ status: false, message: 'experienceData data not found' });
          }
        res.status(200).json({ status: true, data: experienceData });
    }
    catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ********************************************************************************************************************

const deleteExperience = async function(req, res) {
    try {
        const id = req.params.id;
        const experienceData = await experienceModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
        if (!experienceData) {
            return res.status(404).send({ status: false, message: 'experienceData data not found' });
          }
        res.status(200).json({ status: true, message: 'Experience information deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ********************************************************************************************************************

const projectInformation = async function(req, res) {
    try {
        const id = req.params.id;
        const projectData = await projectsModel.findOne({ _id: id });
        if (!projectData) {
            return res.status(404).send({ status: false, message: 'projectData data not found' });
          }
        res.status(200).json({ status: true, data: projectData });
    }
    catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ********************************************************************************************************************

const deleteProject = async function(req, res) {
    try {
        const id = req.params.id;
        const projectData = await projectsModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
        if (!projectData) {
            return res.status(404).send({ status: false, message: 'projectData data not found' });
          }
        res.status(200).json({ status: true, message: 'Project information deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ********************************************************************************************************************

const skillsInformation = async function(req, res) {
    try {
        const id = req.params.id;
        const skillsData = await skillsModel.findOne({ _id: id });
        if (!skillsData) {
            return res.status(404).send({ status: false, message: 'skillsData data not found' });
          }
        res.status(200).json({ status: true, data: skillsData });
    }
    catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// ********************************************************************************************************************

const deleteSkills = async function(req, res) {
    try {
        const id = req.params.id;
        const skillsData = await skillsModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
        if (!skillsData) {
            return res.status(404).send({ status: false, message: 'skillsData data not found' });
          }
        res.status(200).json({ status: true, message: 'Skills information deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};



module.exports = {projectInformation, skillsInformation, experienceInformation, educationInformation, educationInfo, updateEducationData, experienceInfo, updateExperienceData, projectInfo, skillsInfo, updateSkillsData, personalInfo, deleteSkills, deleteProject, deleteExperience, deleteEducation };
