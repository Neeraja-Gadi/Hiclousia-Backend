
const userModel = require("../Models/userModel");
const educationModel = require('../Models/InfoModels/educationModel');
const experienceModel = require('../Models/InfoModels/experienceModel');
const skillsModel = require('../Models/InfoModels/skillsModel');
const userprofileModel = require('../Models/userprofileModel');
const recruiterModel = require('../Models/recruiterModel');
const jobModel = require('../Models/jobModel');
const nodemailer = require('nodemailer');
// **************************************************************************************************************



// **************************************************************************************************************
const findJobMatches = async function (req, res) {
  try {
    const userId = req.params.id; //USERID

    // Fetch user details
    const userDetails = await userModel.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user's education details
    const educationDetails = await educationModel
      .findOne({ userDetailsID: userDetails._id })
      .lean();

    // Fetch user's experience details
    const experienceDetails = await experienceModel
      .findOne({ userDetailsID: userDetails._id })
      .lean();

    // Fetch user's skills details
    const skillsDetails = await skillsModel
      .findOne({ userDetailsID: userDetails._id })
      .lean();

    // Fetch user's profile details
    const userProfileDetails = await userprofileModel
      .findOne({ userDetailsID: userDetails._id })
      .lean();

    // Convert userProfileDetails.location to string
    const locationString = userProfileDetails.location.toString();

    // Perform word matches in jobModel fields
    const jobMatches = await jobModel.find({
      $or: [
        { jobRole: { $in: experienceDetails.jobRole } },
        { education: { $elemMatch: { educationLevel: educationDetails.educationLevel } } },
        { experience: { $in: experienceDetails.experience } },
        { location: { $regex: locationString, $options: "i" } },
      ],
    });

    res.json({ jobMatches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ********************************************************************************************************************

const jwt = require("jsonwebtoken");
const Joi = require('joi');

const { upload } = require('./awsController.js');

const userGeneral = async function (req, res) {
  try {
    upload.fields([
      { name: 'profileLink', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ])(req, res, async function (err) {
      if (err) {
        return res.status(500).send({ status: false, message: err.message });
      }

      const { userDetailsID, gitLink, gender, doB, phone, location, aboutMe, salary } = req.body;
      const { profileLink, document } = req.files;

      if (!profileLink || !document) {
        return res.status(400).send({ status: false, message: 'profileLink and document are required' });
      }

      const userProfileData = {
        userDetailsID,
        gitLink,
        gender,
        doB,
        phone,
        location,
        aboutMe,
        salary,
        profileLink: {
          key: req.files.profileLink[0].key,
          url: req.files.profileLink[0].location
        },
        document: {
          key: req.files.document[0].key,
          url: req.files.document[0].location
        }
      };

      const data = await userprofileModel.create(userProfileData);

      if (data) {
        return res.status(200).send({ status: true, data: data, message: 'User profile data created' });
      }
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ************************************************************************************************************

const updateuserProfile = async function (req, res) {
  try {
    const id = req.params.id;

    upload.fields([
      { name: 'profileLink', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ])(req, res, async function (err) {
      if (err) {
        return res.status(500).send({ status: false, message: err.message });
      }

      const { userDetailsID, gitLink, gender, doB, phone, location, aboutMe, salary } = req.body;
      const { profileLink, document } = req.files;

      const userProfileData = {
        userDetailsID,
        gitLink,
        gender,
        doB,
        phone,
        location,
        aboutMe,
        salary
      };

      // Handle file uploads if files exist
      if (profileLink || document) {
        if (profileLink) {
          userProfileData.profileLink = {
            key: req.files.profileLink[0].key,
            url: req.files.profileLink[0].location
          };
        }

        if (document) {
          userProfileData.document = {
            key: req.files.document[0].key,
            url: req.files.document[0].location
          };
        }
      }

      const updatedUserProfile = await userprofileModel.findByIdAndUpdate(id, userProfileData, { new: true });

      if (!updatedUserProfile) {
        return res.status(404).send({ status: false, message: 'User profile not found' });
      }

      return res.status(200).send({ status: true, data: updatedUserProfile, message: 'User profile updated successfully' });
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ********************************************************************************************************************

const deleteuserProfile = async function (req, res) {
  try {
    const id = req.params.id; //mongoose userprofile id
    const userprofileData = await userprofileModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
    if (!userprofileData) {
      return res.status(404).send({ status: false, message: 'userprofileData data not found' });
    }
    res.status(200).json({ status: true, message: 'userprofileData information deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
// ********************************************************************************************************************

const getUserProfileById = async function (req, res) {
  try {
    const id = req.params.id;

    const userProfile = await userprofileModel.findById(id);

    if (!userProfile) {
      return res.status(404).send({ status: false, message: 'User profile not found' });
    }

    return res.status(200).send({ status: true, data: userProfile, message: 'User profile retrieved successfully' });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ********************************************************************************************************************

const register = async function (req, res) {
  try {
    const { firstName, lastName, email, recruiter, password } = req.body;

    const userSchema = Joi.object({
      firstName: Joi.string().pattern(new RegExp("^[a-zA-Z]")).required(),
      lastName: Joi.string().pattern(new RegExp("^[a-zA-Z]")).required(),
      email: Joi.string().email().required(),
      recruiter: Joi.boolean().required(),
      password: Joi.string().min(8).max(15).required()
    });

    const validationResult = userSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
    }

    const userEmail = await userModel.findOne({ email });

    if (userEmail) {
      return res.status(400).send({ status: false, message: "User already exists" });
    }

    const user = await userModel.create({ firstName, lastName, email, password, recruiter });

    if (user) {
      return res.status(201).send({ status: true, message: "User created successfully", data: user });
    } else {
      return res.status(40).send({ status: false, message: "User creation failed" });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ********************************************************************************************************************

const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    const userSchema = Joi.object({
      password: Joi.string().min(8).max(15).required(),
      email: Joi.string().email().required()
    });

    const validationResult = userSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
    }

    const user = await userModel.findOne({ email, password });

    if (!user) {
      res.status(404).send({ status: false, message: "Invalid username or password" });
    } else {
      const token = jwt.sign(user._id.toString(), "Hiclousia"); // should be kept in the env file
      res.status(200).send({ status: true, message: "User logged in successfully", token: token, data: user });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ***********************************************************************************************************

const getUserProfile = async function (req, res) {
  try {
    const { userDetailsID } = req.params;

    const userProfile = await userprofileModel.findOne({ userDetailsID });
    if (!userProfile) {
      return res.status(404).send({ status: false, message: 'User profile not found' });
    }

    return res.status(200).send({ status: true, data: userProfile, message: 'User profile retrieved' });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { register, loginUser, userGeneral, deleteuserProfile, findJobMatches, updateuserProfile, getUserProfile, getUserProfileById };