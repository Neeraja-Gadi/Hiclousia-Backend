const recruiterModel = require("../Models/recruiterModel");
const userprofileModel = require("../Models/userprofileModel");
const userModel = require("../Models/userModel");
const mongoose = require('mongoose');
const jobModel = require("../Models/jobModel");
const educationModel = require("../Models/InfoModels/educationModel");
const experienceModel = require("../Models/InfoModels/experienceModel");
const Joi = require('joi');
const skillsModel = require("../Models/InfoModels/skillsModel");
const projectsModel = require("../Models/InfoModels/projectsModel");
const { EducationLevelPoints, AuthorityPoints, ExperienceLevelPoints } = require("../Constrains/authority.js");
const revenueModel = require('../Models/revenueRModel'); // Import the RecruiterPlan model
// const getRecruiterPlan = async function (req, res) {
//   try {
//     const userDetailsID = req.params.userDetailsID; // Assuming the userDetailsID is passed as a URL parameter

//     // Find the user's subscription details
//     const userSubscription = await revenueModel.findOne({ userDetailsID });

//     if (!userSubscription) {
//       return res.status(404).send({ status: false, message: 'User subscription not found' });
//     }

//     const { recruiterPlan, jobPostno, start } = userSubscription;

//     let duration = 0;
//     if (jobPostno === 1) {
//       duration = 15;
//     } else if (jobPostno === 3) {
//       duration = 60;
//     } else if (jobPostno === 10) {
//       duration = 90;
//     }

//     const dayFromStart = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)); // Calculate days from start

//     let availablePlans = [];
//     let notification = null;

//     // Check if half or three-quarter of the duration has passed
//     if (dayFromStart >= duration / 2 && dayFromStart < (3 * duration) / 4) {
//       notification = 'Half of the duration has passed.';
//     } else if (dayFromStart >= (3 * duration) / 4) {
//       notification = 'Three-quarter of the duration has passed.';
//     }

//     // Retrieve other available plans
//     if (recruiterPlan === 'Gold') {
//       availablePlans = ['Silver', 'Platinum'];
//     } else if (recruiterPlan === 'Silver') {
//       availablePlans = ['Gold', 'Platinum'];
//     } else if (recruiterPlan === 'Platinum') {
//       availablePlans = ['Gold', 'Silver'];
//     }

//     const response = {
//       status: true,
//       data: [{
//         userDetailsID,
//         recruiterPlan,
//         jobPostno,
//         duration,
//         dayFromStart,
//         notification
//       }],
//       availablePlans,
//     };

//     return res.status(200).send(response);
//   } catch (err) {
//     res.status(500).send({ status: false, message: err.message });
//   }
// };


const getRecruiterPlan = async function (req, res) {
  try {
    const userDetailsID = req.params.userDetailsID; // Assuming the userDetailsID is passed as a URL parameter

    // Find the user's subscription details
    const userSubscriptions = await revenueModel.find({ userDetailsID });

    if (userSubscriptions.length === 0) {
      return res.status(404).send({ status: false, message: 'User subscriptions not found' });
    }

    const response = {
      status: true,
      data: [],
      availablePlans: [],
    };

    for (const userSubscription of userSubscriptions) {
      const { recruiterPlan, jobPostno, start } = userSubscription;

      let duration = 0;
      if (jobPostno === 1) {
        duration = 15;
      } else if (jobPostno === 3) {
        duration = 60;
      } else if (jobPostno === 10) {
        duration = 90;
      }

      const dayFromStart = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)); // Calculate days from start

      let notification = null;

      // Check if half or three-quarter of the duration has passed
      if (dayFromStart >= duration / 2 && dayFromStart < (3 * duration) / 4) {
        notification = 'Half of the duration has passed.';
      } else if (dayFromStart >= (3 * duration) / 4) {
        notification = 'Three-quarter of the duration has passed.';
      } else if (dayFromStart===duration && dayFromStart <=duration){
        notification = 'Duration Over.';
      }

      response.data.push({
        userDetailsID,
        recruiterPlan,
        jobPostno,
        duration,
        dayFromStart,
        notification
      });

      // Retrieve other available plans
      if (!response.availablePlans.includes(recruiterPlan)) {
        response.availablePlans.push(recruiterPlan);
      }
    }

    return res.status(200).send(response);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


// const getRecruiterPlan = async function (req, res) {
//   try {
//     const userDetailsID = req.params.userDetailsID; // Assuming the userDetailsID is passed as a URL parameter

//     // Find the user's subscription details
//     const userSubscription = await revenueModel.findOne({ userDetailsID });

//     if (!userSubscription) {
//       return res.status(404).send({ status: false, message: 'User subscription not found' });
//     }

//     const { recruiterPlan, jobPostno, start } = userSubscription;

//     let duration = 0;
//     if (jobPostno === 1) {
//       duration = 15;
//     } else if (jobPostno === 3) {
//       duration = 60;
//     } else if (jobPostno === 10) {
//       duration = 90;
//     }

//     const dayFromStart = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)); // Calculate days from start

//     let availablePlans = [];
//     let notification = null;

//     // Check if half or three-quarter of the duration has passed
//     if (dayFromStart >= duration / 2 && dayFromStart < (3 * duration) / 4) {
//       notification = 'Half of the duration has passed.';
//     } else if (dayFromStart >= (3 * duration) / 4) {
//       notification = 'Three-quarter of the duration has passed.';
//     }

//     // Retrieve other available plans
//     if (recruiterPlan === 'Gold') {
//       availablePlans = ['Silver', 'Platinum'];
//     } else if (recruiterPlan === 'Silver') {
//       availablePlans = ['Gold', 'Platinum'];
//     } else if (recruiterPlan === 'Platinum') {
//       availablePlans = ['Gold', 'Silver'];
//     }

//     return res.status(200).send({
//       status: true,
//       data: {
//         userDetailsID,
//         recruiterPlan,
//         jobPostno,
//         duration,
//         dayFromStart
//       },
//       availablePlans,
//       notification
//     });
//   } catch (err) {
//     res.status(500).send({ status: false, message: err.message });
//   }
// };



// *******RevenuePlan*******************RevenuePlan**********************RevenuePlan************************RevenuePlan******************************
const RevenuePlan = async function (req, res) {
  try {
    const revenueSchema = Joi.object({
      userDetailsID: Joi.string().required(),
      recruiterPlan: Joi.string().valid("Gold", "Silver", "Platinum").required(),
      jobPostno: Joi.number().required(),
      duration: Joi.number().required(),
      start: Joi.date().default(Date.now),
      isDeleted: Joi.boolean().default(false)
    });

    const validationResult = revenueSchema.validate(req.body, { abortEarly: true });
    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
    }

    const data = await revenueModel.create(req.body);
    if (data) {
      return res.status(200).send({ status: true, data: data, message: 'Revenue data created' });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
// *******recruiterInfo*******************recruiterInfo**********************recruiterInfo************************recruiterInfo**********************
const recruiterInfo = async function (req, res) {
  try {
    const recruiterSchema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      professionalSummary: Joi.string(),
      workExperience: Joi.array().items(
        Joi.object({
          company: Joi.string().required(),
          jobTitle: Joi.string().required()
        })
      ).required(),
      awards: Joi.array().items(Joi.string()),
      socialMediaLinks: Joi.object({
        linkedin: Joi.string(),
        twitter: Joi.string()
      })
    });
    const validationResult = recruiterSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
    }
    // Create new recruiter data
    const data = await recruiterModel.create(req.body);
    if (data)
      return res.status(200).send({ status: true, data: data, message: 'Recruiter data created' });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
// *******deleteRecruiter*******************deleteRecruiter**********************deleteRecruiter************************deleteRecruiter**************
const deleteRecruiter = async function (req, res) {
  try {
    const id = req.params.id;
    const recruiterData = await recruiterModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
    if (!recruiterData) {
      return res.status(404).send({ status: false, message: 'recruiterData data not found' });
    }

    res.status(200).json({ status: true, message: 'Education information deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
// ********updateRecruiterData***************updateRecruiterData**************updateRecruiterData*******************updateRecruiterData**************
const updateRecruiterData = async function (req, res) {
  try {
    const recruiterSchema = Joi.object({
      fullName: Joi.string(),
      email: Joi.string(),
      phoneNumber: Joi.string(),
      professionalSummary: Joi.string(),
      workExperience: Joi.array().items(
        Joi.object({
          company: Joi.string().required(),
          jobTitle: Joi.string().required()
        })
      ),
      awards: Joi.array().items(Joi.string()),
      socialMediaLinks: Joi.object({
        linkedin: Joi.string(),
        twitter: Joi.string()
      })
    });

    const validationResult = recruiterSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(400).send({ status: false, message: validationResult.error.details[0].message });
    }

    const id = req.params.id;
    let recruiterData = await recruiterModel.findById({ _id: id });
    if (!recruiterData) {
      return res.status(404).send({ status: false, message: 'Recruiter data not found' });
    }

    recruiterData.fullName = req.body.fullName || recruiterData.fullName;
    recruiterData.email = req.body.email || recruiterData.email;
    recruiterData.phoneNumber = req.body.phoneNumber || recruiterData.phoneNumber;
    recruiterData.professionalSummary = req.body.professionalSummary || recruiterData.professionalSummary;
    recruiterData.workExperience = req.body.workExperience || recruiterData.workExperience;
    recruiterData.awards = req.body.awards || recruiterData.awards;
    recruiterData.socialMediaLinks = req.body.socialMediaLinks || recruiterData.socialMediaLinks;

    const updatedData = await recruiterModel.findByIdAndUpdate({ _id: id }, recruiterData, { new: true });
    return res.status(200).send({ status: true, data: updatedData, message: 'Recruiter data updated' });


  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
// *********************jobSearch************************jobSearch*************************jobSearch***********************jobSearch**************
async function jobSearch(req, res) {
  try {
    const jobId = req.params.id;

    const job = await jobModel.findById(jobId).lean().populate('userDetailsID', 'recruiter');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const requiredEducationLevels = job.education.map(edu => edu.educationLevel);
    const requiredJobRole = job.jobRole;
    const requiredPrimarySkills = job.primarySkills;
    const requiredSecondarySkills = job.secondarySkills;

    const users = await userModel.find({ recruiter: false }).lean();

    const usersWithDetails = await Promise.all(users.map(async (user) => {
      const education = await educationModel.findOne({ userDetailsID: user._id }).lean();
      const experience = await experienceModel.findOne({ userDetailsID: user._id }).lean();
      const skill = await skillsModel.findOne({ userDetailsID: user._id }).lean();
      const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        education,
        experience,
        skill,
        userProfile
      };
    }));

    const matchedUsers = usersWithDetails.filter((user) => {
      return requiredEducationLevels.includes(user.education.educationLevel) &&
        user.experience.jobRole === requiredJobRole;
    }).map((user) => {
      const primarySkillMatchCount = user.skill.primarySkills.filter((skill) => requiredPrimarySkills.includes(skill)).length;
      const primarySkillPercentageMatch = primarySkillMatchCount / requiredPrimarySkills.length * 100;
      console.log(primarySkillPercentageMatch);


      const secondarySkillMatchCount = user.skill.secondarySkills.filter((skill) => requiredSecondarySkills.includes(skill)).length;
      const secondarySkillPercentageMatch = secondarySkillMatchCount / requiredSecondarySkills.length * 100;

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.userProfile.phone,
        aboutMe: user.userProfile.aboutMe,
        educationLevel: user.education.educationLevel,
        experience: user.experience.experience,
        jobRole: user.experience.jobRole,
        primarySkills: user.skill.primarySkills,
        primarySkillPercentageMatch,
        secondarySkills: user.skill.secondarySkills,
        secondarySkillPercentageMatch,
        location: user.userProfile.location,

        salary: user.userProfile.salary,
      };
    });

    // sort the matchedUsers by primarySkill Percentage match in descending order

    matchedUsers.sort((a, b) => b.primarySkillPercentageMatch - a.primarySkillPercentageMatch);


    // get the first matched user
    const matchedUser = matchedUsers[0];
    const percentageMatches = [
      { percentage: "70-100", users: matchedUsers.filter((user) => user.primarySkillPercentageMatch >= 80) },
      { percentage: "50-70", users: matchedUsers.filter((user) => user.primarySkillPercentageMatch >= 50 && user.primarySkillPercentageMatch < 80) },
      { percentage: "25-50", users: matchedUsers.filter((user) => user.primarySkillPercentageMatch >= 25 && user.primarySkillPercentageMatch < 50) },
      { percentage: "0", users: matchedUsers.filter((user) => user.primarySkillPercentageMatch < 25) },
    ];


    const data = { job, percentageMatches };
    return res.status(200).send({ status: true, data, message: 'success' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};
// **************searchJobseekerGeneral************searchJobseekerGeneral*************searchJobseekerGeneral***************searchJobseekerGeneral*
const searchJobseekerGeneral = async (req, res) => {
  try {
    const { experience, educationalLevel, discipline, primarySkills } = req.query;

    const query = {};

    if (experience) {
      const experienceArray = experience.split(",");
      query.experience = { $in: experienceArray.map(experience => new RegExp(experience.trim(), 'i')) };
    }

    if (educationalLevel) {
      query.educationLevel = { $regex: educationalLevel, $options: 'i' };
    }

    if (discipline) {
      query.discipline = { $regex: discipline, $options: 'i' };
    }

    if (primarySkills) {
      query.primarySkills = { $regex: primarySkills, $options: 'i' };
    }

    const skillDetails = await mongoose.model('Skills').find(query).populate('userDetailsID.skills');

    const educationDetails = await mongoose.model('Education').find(query).populate('userDetailsID.education');
    const experienceDetails = await mongoose.model('Experience').find(query).populate('UserDetailsID.experience');

    console.log('skillDetails:', skillDetails);
    console.log('educationDetails:', educationDetails);
    console.log('experienceDetails:', experienceDetails);

    const data = { skillDetails, educationDetails, experienceDetails };

    if (skillDetails.length === 0 && educationDetails.length === 0 && experienceDetails.length === 0) {
      return res.status(404).json({ status: false, message: 'Data not found' });
    }

    return res.status(200).send({ status: true, data: data, message: 'Success' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};
// **************recruiterSearch************recruiterSearch*******************recruiterSearch******************recruiterSearch********************
async function recruiterSearch(req, res) {
  try {
    const { primarySkills, secondarySkills, experience, educationLevel, location } = req.query;
    const schema = Joi.object({
      primarySkills: Joi.string().allow(''),
      secondarySkills: Joi.string().allow(''),
      experience: Joi.string().allow(''),
      educationLevel: Joi.string().allow(''),
      location: Joi.string().allow('')
    });
    const validation = schema.validate(req.query, { abortEarly: false });
    if (validation.error) {
      return res.status(400).send({ message: validation.error.details.map(d => d.message) });
    }
    const skillsQuery = {};
    if (primarySkills) {
      skillsQuery.primarySkills = { $in: primarySkills.split(",").map(s => new RegExp(`^${s.trim()}$`, 'i')) };
    }
    if (secondarySkills) {
      skillsQuery.secondarySkills = { $in: secondarySkills.split(",").map(s => new RegExp(`^${s.trim()}$`, 'i')) };
    }
    const educationQuery = {};
    if (educationLevel) {
      educationQuery.educationLevel = { $in: educationLevel.split(",").map(level => new RegExp(`^${level.trim()}$`, 'i')) };
    }
    const experienceArray = experience ? experience.split(",").map(s => s.trim()) : [];
    const userProfileQuery = {};
    if (location) {
      userProfileQuery.location = { $in: location.split(",").map(loc => new RegExp(`^${loc.trim()}$`, 'i')) };
    }
    const users = await userModel.find({ recruiter: false });
    const education = await educationModel.find(educationQuery, 'userDetailsID educationLevel collegeName authority discipline yearOfpassout');
    const experienceResults = await experienceModel.find({}, 'userDetailsID experience');
    const skills = await skillsModel.find(skillsQuery, 'userDetailsID primarySkills secondarySkills');
    const userProfiles = await userprofileModel.find(userProfileQuery, 'userDetailsID location');
    const result = users.map((user) => {
      const userExperience = experienceResults.find(ex => ex.userDetailsID.toString() === user._id.toString()) || {};
      const userEducation = education.find(e => e.userDetailsID.toString() === user._id.toString()) || {};
      const userSkills = skills.find(s => s.userDetailsID.toString() === user._id.toString()) || {};
      const userProfile = userProfiles.find(p => p.userDetailsID.toString() === user._id.toString()) || {};
      let matchCount = 0;
      if (primarySkills && userSkills.primarySkills && userSkills.primarySkills.some(s => primarySkills.split(",").map(p => p.trim()).includes(s))) {
        matchCount++;
      }
      if (secondarySkills && userSkills.secondarySkills && userSkills.secondarySkills.some(s => secondarySkills.split(",").map(p => p.trim()).includes(s))) {
        matchCount++;
      }
      if (experienceArray.length > 0 && userExperience.experience && experienceArray.includes(userExperience.experience)) {
        matchCount++;
      }
      if (educationLevel && userEducation.educationLevel && educationLevel.split(",").map(level => new RegExp(`^${level.trim()}$`, 'i')).some(regex => regex.test(userEducation.educationLevel))) {
        matchCount++;
      }
      if (location && userProfile.location && location.split(",").map(loc => new RegExp(`^${loc.trim()}$`, 'i')).some(regex => regex.test(userProfile.location))) {
        matchCount++;
      }
      if (matchCount === 0) {
        return null;
      } else {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          educationLevel: userEducation.educationLevel || '',
          collegeName: userEducation.collegeName || '',
          authority: userEducation.authority || '',
          discipline: userEducation.discipline || '',
          yearOfpassout: userEducation.yearOfpassout || '',
          experience: userExperience.experience || {},
          primarySkills: userSkills.primarySkills || '',
          secondarySkills: userSkills.secondarySkills || '',
          location: userProfile.location || ''
        };
      }
    }).filter(result => result !== null);
    res.status(200).send({ status: true, data: result, message: 'Success' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
// **************recruiterInformation************recruiterInformation*******************recruiterInformation******************recruiterInformation**
const recruiterInformation = async function (req, res) {
  try {
    const id = req.params.id;
    const recruiterData = await recruiterModel.find({ _id: id });
    if (!recruiterData) {
      return res.status(404).send({ status: false, message: 'recruiterData data not found' });
    }
    res.status(200).send({ status: true, data: recruiterData });
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
// ************talentPool**********************talentPool*****************************talentPool******************talentPool***********************
const talentPool = async function (req, res) {
  try {
    const allUsers = await userModel.find({ recruiter: false }).lean();

    const advancePool = [];
    const proficientPool = [];
    const expertPool = [];

    await Promise.all(
      allUsers.map(async (user) => {
        const educationDetails = await educationModel.find({ userDetailsID: user._id }).lean();
        const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).lean();
        const skillsDetails = await skillsModel.findOne({ userDetailsID: user._id }).lean();
        const projectDetails = await projectsModel.findOne({ userDetailsID: user._id }).lean();
        const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

        let score = 0;
        let highestAuthority = 0;
        let highestEducationLevel = '';

        for (let educationIndex = 0; educationIndex < educationDetails.length; educationIndex++) {
          const educationDetail = educationDetails[educationIndex];
          const educationLevel = educationDetail.educationLevel;
          const authority = educationDetail.authority;

          const authorityScore = AuthorityPoints[authority] || 0;

          if (authorityScore > highestAuthority) {
            highestAuthority = authorityScore;
            highestEducationLevel = educationLevel;
          }
        }

        for (let experienceIndex = 0; experienceIndex < experienceDetails.length; experienceIndex++) {
          const experienceDetail = experienceDetails[experienceIndex];
          const experience = experienceDetail.experience;

          const educationScore = EducationLevelPoints[highestEducationLevel] || 0;
          const experienceScore = ExperienceLevelPoints[experience] || 0;

          const detailScore = highestAuthority + educationScore + experienceScore;

          if (detailScore > score) {
            score = detailScore;
          }
        }

        const authorities = educationDetails.map(detail => detail.authority);
        const experiences = experienceDetails.map(detail => detail.experience);

        if (
          (authorities.includes('Central Govt') ||
            authorities.includes('State Govt') ||
            authorities.includes('Demeed University') ||
            authorities.includes('Private')) &&
          (experiences.includes('Fresher') ||
            experiences.includes('1 Year') ||
            experiences.includes('2 Year'))
        ) {
          advancePool.push({
            hiRank: score,
            user,
            educationDetails,
            experienceDetails,
            skillsDetails,
            projectDetails,
            userProfile
          });
        } else if (
          (authorities.includes('IIT') ||
            authorities.includes('IIM') ||
            authorities.includes('IISc') ||
            authorities.includes('NIT')) &&
          (
            experiences.includes('3 Year') ||
            experiences.includes('4 Year') ||
            experiences.includes('5 Year')
          )
        ) {
          proficientPool.push({
            hiRank: score,
            user,
            educationDetails,
            experienceDetails,
            skillsDetails,
            projectDetails,
            userProfile
          });
        } else if (
          (authorities.includes('IIT') ||
            authorities.includes('IIM') ||
            authorities.includes('IISc') ||
            authorities.includes('NIT') ||
            authorities.includes('Central Govt') ||
            authorities.includes('State Govt') ||
            authorities.includes('Demeed University') ||
            authorities.includes('Private')) &&
          (experiences.includes('6 Year') ||
            experiences.includes('7 Year') ||
            experiences.includes('8 Year') ||
            experiences.includes('9 Year') ||
            experiences.includes('10 Year') ||
            experiences.includes('11 to 15 Year') ||
            experiences.includes('15 to 20 Year') ||
            experiences.includes('20+ Year'))
        ) {
          expertPool.push({
            hiRank: score,
            user,
            educationDetails,
            experienceDetails,
            skillsDetails,
            projectDetails,
            userProfile
          });
        }
      })
    );

    const categorizedData = {
      advancePool,
      proficientPool,
      expertPool,
    };

    res.status(200).json(categorizedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// **********talentPool************talentPool************talentPool************talentPool************talentPool***********Ends****Here

// *******************************************working7*****************************************************************************

// const talentPool = async function (req, res) {
//   try {
//     const allUsers = await userModel.find({ recruiter: false }).lean();

//     const advancePool = [];
//     const proficientPool = [];
//     const expertPool = [];

//     await Promise.all(
//       allUsers.map(async (user) => {
//         const educationDetails = await educationModel.find({ userDetailsID: user._id }).lean();
//         const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).lean();
//         const skillsDetails = await skillsModel.findOne({ userDetailsID: user._id }).lean();
//         const projectDetails = await projectsModel.findOne({ userDetailsID: user._id }).lean();
//         const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

//         let score = 0;

//         // Calculate score for each education and experience detail
//         educationDetails.forEach((education) => {
//           experienceDetails.forEach((experience) => {
//             const educationLevel = education.educationLevel;
//             const authority = education.authority;
//             const experienceValue = experience.experience;

//             const educationScore = EducationLevelPoints[educationLevel] || 0;
//             const authorityScore = AuthorityPoints[authority] || 0;
//             const experienceScore = ExperienceLevelPoints[experienceValue] || 0;

//             const detailScore = educationScore + authorityScore + experienceScore;

//             if (detailScore > score) {
//               score = detailScore;
//             }
//           });
//         });

//         // Categorize users into pools
//         if (educationDetails.length > 0 && experienceDetails.length > 0) {
//           const authority = educationDetails[0].authority;
//           const experience = experienceDetails[0].experience;

//           if (
//             (authority === 'Central Govt' ||
//               authority === 'State Govt' ||
//               authority === 'Demeed University' ||
//               authority === 'Private') &&
//             (experience === 'Fresher' ||
//               experience === '1 Year' ||
//               experience === '2 Year')
//           ) {
//             advancePool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//             });
//           } else if (
//             (authority === 'IIT' ||
//               authority === 'IIM' ||
//               authority === 'IISc' ||
//               authority === 'NIT') &&
//             (experience === '3 Year' ||
//               experience === '4 Year' ||
//               experience === '5 Year')
//           ) {
//             proficientPool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//             });
//           } else if (
//             (authority === 'IIT' ||
//               authority === 'IIM' ||
//               authority === 'IISc' ||
//               authority === 'NIT' ||
//               authority === 'Central Govt' ||
//               authority === 'State Govt' ||
//               authority === 'Demeed University' ||
//               authority === 'Private') &&
//             (experience === '6 Year' ||
//               experience === '7 Year' ||
//               experience === '8 Year' ||
//               experience === '9 Year' ||
//               experience === '10 Year' ||
//               experience === '11 to 15 Year' ||
//               experience === '15 to 20 Year' ||
//               experience === '20+ Year')
//           ) {
//             expertPool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//             });
//           }
//         }
//       })
//     );

//     const categorizedData = {
//       advancePool,
//       proficientPool,
//       expertPool,
//     };

//     res.status(200).json(categorizedData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const talentPool = async function (req, res) {
//   try {
//     const allUsers = await userModel.find({ recruiter: false }).lean();

//     const advancePool = [];
//     const proficientPool = [];
//     const expertPool = [];

//     await Promise.all(
//       allUsers.map(async (user) => {
//         const educationDetails = await educationModel.find({ userDetailsID: user._id }).lean();
//         const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).lean();
//         const skillsDetails = await skillsModel.findOne({ userDetailsID: user._id }).lean();
//         const projectDetails = await projectsModel.findOne({ userDetailsID: user._id }).lean();
//         const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

//         let hiRank = 0;

//         for (let educationIndex = 0; educationIndex < educationDetails.length; educationIndex++) {
//           const educationDetail = educationDetails[educationIndex];
//           const educationLevel = educationDetail.educationLevel;
//           const authority = educationDetail.authority;

//           for (let experienceIndex = 0; experienceIndex < experienceDetails.length; experienceIndex++) {
//             const experienceDetail = experienceDetails[experienceIndex];
//             const experience = experienceDetail.experience;

//             const educationScore = EducationLevelPoints[educationLevel] || 0;
//             const authorityScore = AuthorityPoints[authority] || 0;
//             const experienceScore = ExperienceLevelPoints[experience] || 0;

//             const detailScore = educationScore + authorityScore + experienceScore;

//             if (detailScore > hiRank) {
//               hiRank = detailScore;
//             }
//           }
//         }

//         const authorities = educationDetails.map(detail => detail.authority);
//         const experiences = experienceDetails.map(detail => detail.experience);

//         if (
//           (authorities.includes('Central Govt') ||
//             authorities.includes('State Govt') ||
//             authorities.includes('Demeed University') ||
//             authorities.includes('Private')) &&
//           (experiences.includes('Fresher') ||
//             experiences.includes('1 Year') ||
//             experiences.includes('2 Year'))
//         ) {
//           advancePool.push({
//             hiRank,
//             user,
//             educationDetails,
//             experienceDetails,
//             skillsDetails,
//             projectDetails,
//             userProfile
//           });
//         } else if (
//           (authorities.includes('IIT') ||
//             authorities.includes('IIM') ||
//             authorities.includes('IISc') ||
//             authorities.includes('NIT')) &&
//           (
//             experiences.includes('3 Year') ||
//             experiences.includes('4 Year') ||
//             experiences.includes('5 Year')
//           )
//         ) {
//           proficientPool.push({
//             hiRank,
//             user,
//             educationDetails,
//             experienceDetails,
//             skillsDetails,
//             projectDetails,
//             userProfile
//           });
//         } else if (
//           (authorities.includes('IIT') ||
//             authorities.includes('IIM') ||
//             authorities.includes('IISc') ||
//             authorities.includes('NIT') ||
//             authorities.includes('Central Govt') ||
//             authorities.includes('State Govt') ||
//             authorities.includes('Demeed University') ||
//             authorities.includes('Private')) &&
//           (experiences.includes('6 Year') ||
//             experiences.includes('7 Year') ||
//             experiences.includes('8 Year') ||
//             experiences.includes('9 Year') ||
//             experiences.includes('10 Year') ||
//             experiences.includes('11 to 15 Year') ||
//             experiences.includes('15 to 20 Year') ||
//             experiences.includes('20+ Year'))
//         ) {
//           expertPool.push({
//             hiRank,
//             user,
//             educationDetails,
//             experienceDetails,
//             skillsDetails,
//             projectDetails,
//             userProfile
//           });
//         }
//       })
//     );

//     const categorizedData = {
//       advancePool,
//       proficientPool,
//       expertPool,
//     };

//     res.status(200).json(categorizedData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




// **********************************************************************************************************

// const { EducationLevelPoints, AuthorityPoints, ExperienceLevelPoints } = require("../Constrains/authority.js");

// const PREP = async function (req, res) {
//   try {
//     const allUsers = await userModel.find({ recruiter: false, isDeleted:false }).lean();

//     const advancePool = [];
//     const proficientPool = [];
//     const expertPool = [];

//     await Promise.all(
//       allUsers.map(async (user) => {
//         const educationDetails = await educationModel.find({ userDetailsID: user._id }).lean();
//         const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).lean();
//         const skillsDetails = await skillsModel.findOne({ userDetailsID: user._id }).lean();
//         const projectDetails = await projectsModel.findOne({ userDetailsID: user._id }).lean();
//         const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

//         let score = 0;

//         // Calculate score for each education and experience detail
//         educationDetails.forEach((education) => {
//           experienceDetails.forEach((experience) => {
//             const educationLevel = education.educationLevel;
//             const authority = education.authority;
//             const experienceValue = experience.experience;

//             const educationScore = EducationLevelPoints[educationLevel] || 0;
//             const authorityScore = AuthorityPoints[authority] || 0;
//             const experienceScore = ExperienceLevelPoints[experienceValue] || 0;

//             const detailScore = educationScore + authorityScore + experienceScore;

//             if (detailScore > score) {
//               score = detailScore;
//             }
//           });
//         });

//         // Categorize users into pools
//         if (educationDetails.length > 0 && experienceDetails.length > 0) {
//           const authority = educationDetails[0].authority;
//           const experience = experienceDetails[0].experience;
//           const education = educationDetails[0].education;

//           // Rest of the code...
//         } else {
//           // Handle the case when educationDetails or experienceDetails is empty
//         }
//         const authority = educationDetails[0].authority;
//         const experience = experienceDetails[0].experience;
//         const education = educationDetails[0].education;

//         if (
//           (authority === 'Central Govt' ||
//             authority === 'State Govt' ||
//             authority === 'Demeed University' ||
//             authority === 'Private') &&
//           (experience === 'Fresher' ||
//             experience === '1 Year' ||
//             experience === '2 Year' ) 
//         ) {
//           advancePool.push({
//             hiRank: score,
//             user,
//             educationDetails,
//             experienceDetails,
//             skillsDetails,
//             projectDetails,
//             userProfile,
//           });
//         } else if (
//           (authority === 'IIT' ||
//             authority === 'IIM' ||
//             authority === 'IISc' ||
//             authority === 'NIT') &&
//           (
//             experience === '3 Year' ||
//             experience === '4 Year' ||
//             experience === '5 Year') 
//         ) {
//           proficientPool.push({
//             hiRank: score,
//             user,
//             educationDetails,
//             experienceDetails,
//             skillsDetails,
//             projectDetails,
//             userProfile,
//           });
//         } else if (
//           (authority === 'IIT' ||
//             authority === 'IIM' ||
//             authority === 'IISc' ||
//             authority === 'NIT' ||
//             authority === 'Central Govt' ||
//             authority === 'State Govt' ||
//             authority === 'Demeed University' ||
//             authority === 'Private') &&
//           (experience === '6 Year' ||
//             experience === '7 Year' ||
//             experience === '8 Year' ||
//             experience === '9 Year' ||
//             experience === '10 Year' ||
//             experience === '11 to 15 Year' ||
//             experience === '15 to 20 Year' ||
//             experience === '20+ Year')

//         ) {
//           expertPool.push({
//             hiRank: score,
//             user,
//             educationDetails,
//             experienceDetails,
//             skillsDetails,
//             projectDetails,
//             userProfile,
//           });
//         }
//       })
//     );

//     const categorizedData = {
//       advancePool,
//       proficientPool,
//       expertPool,
//     };

// WORKING
const PREP = async function (req, res) {
  try {
    const allUsers = await userModel.find({ recruiter: false, isDeleted: false }).lean();

    const advancePool = [];
    const proficientPool = [];
    const expertPool = [];

    await Promise.all(
      allUsers.map(async (user) => {
        const educationDetails = await educationModel.find({ userDetailsID: user._id }).lean();
        const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).lean();
        const skillsDetails = await skillsModel.findOne({ userDetailsID: user._id }).lean();
        const projectDetails = await projectsModel.findOne({ userDetailsID: user._id }).lean();
        const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

        let score = 0;

        // Calculate score for each education and experience detail
        educationDetails.forEach((education) => {
          experienceDetails.forEach((experience) => {
            const educationLevel = education.educationLevel;
            const authority = education.authority;
            const experienceValue = experience.experience;

            const educationScore = EducationLevelPoints[educationLevel] || 0;
            const authorityScore = AuthorityPoints[authority] || 0;
            const experienceScore = ExperienceLevelPoints[experienceValue] || 0;

            const detailScore = educationScore + authorityScore + experienceScore;

            if (detailScore > score) {
              score = detailScore;
            }
          });
        });

        // Categorize users into pools
        if (educationDetails.length > 0 && experienceDetails.length > 0) {
          const authority = educationDetails[0].authority;
          const experience = experienceDetails[0].experience;
          const education = educationDetails[0].education;

          if (
            (authority === 'Central Govt' ||
              authority === 'State Govt' ||
              authority === 'Demeed University' ||
              authority === 'Private') &&
            (experience === 'Fresher' ||
              experience === '1 Year' ||
              experience === '2 Year')
          ) {
            advancePool.push({
              hiRank: score,
              user,
              educationDetails,
              experienceDetails,
              skillsDetails,
              projectDetails,
              userProfile,
            });
          } else if (
            (authority === 'IIT' ||
              authority === 'IIM' ||
              authority === 'IISc' ||
              authority === 'NIT') &&
            (experience === '3 Year' ||
              experience === '4 Year' ||
              experience === '5 Year')
          ) {
            proficientPool.push({
              hiRank: score,
              user,
              educationDetails,
              experienceDetails,
              skillsDetails,
              projectDetails,
              userProfile,
            });
          } else if (
            (authority === 'IIT' ||
              authority === 'IIM' ||
              authority === 'IISc' ||
              authority === 'NIT' ||
              authority === 'Central Govt' ||
              authority === 'State Govt' ||
              authority === 'Demeed University' ||
              authority === 'Private') &&
            (experience === '6 Year' ||
              experience === '7 Year' ||
              experience === '8 Year' ||
              experience === '9 Year' ||
              experience === '10 Year' ||
              experience === '11 to 15 Year' ||
              experience === '15 to 20 Year' ||
              experience === '20+ Year')
          ) {
            expertPool.push({
              hiRank: score,
              user,
              educationDetails,
              experienceDetails,
              skillsDetails,
              projectDetails,
              userProfile,
            });
          }
        }
      })
    );

    const categorizedData = {
      advancePool,
      proficientPool,
      expertPool,
    };

    // Job Search functionality
    // Job Search functionality
    const jobId = req.params.id;

    const job = await jobModel.findById(jobId).lean().populate('userDetailsID', 'recruiter');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const requiredEducationLevels = job.education.map(edu => edu.educationLevel);
    const requiredJobRole = job.jobRole;
    const requiredPrimarySkills = job.primarySkills;
    const requiredSecondarySkills = job.secondarySkills;

    categorizedData.advancePool.forEach((user) => {
      const educationLevel = user.educationDetails[0].educationLevel;
      const experienceJobRole = user.experienceDetails[0].jobRole;

      if (requiredEducationLevels.includes(educationLevel) && experienceJobRole === requiredJobRole) {
        const primarySkillMatchCount = user.skillsDetails.primarySkills.filter((skill) => requiredPrimarySkills.includes(skill)).length;
        const primarySkillPercentageMatch = (primarySkillMatchCount / requiredPrimarySkills.length) * 100;

        user.primarySkillPercentageMatch = primarySkillPercentageMatch;
        advancePool.push(user);
      }
    });

    categorizedData.proficientPool.forEach((user) => {
      const educationLevel = user.educationDetails[0].educationLevel;
      const experienceJobRole = user.experienceDetails[0].jobRole;

      if (requiredEducationLevels.includes(educationLevel) && experienceJobRole === requiredJobRole) {
        const primarySkillMatchCount = user.skillsDetails.primarySkills.filter((skill) => requiredPrimarySkills.includes(skill)).length;
        const primarySkillPercentageMatch = (primarySkillMatchCount / requiredPrimarySkills.length) * 100;

        user.primarySkillPercentageMatch = primarySkillPercentageMatch;
        proficientPool.push(user);
      }
    });

    categorizedData.expertPool.forEach((user) => {
      const educationLevel = user.educationDetails[0].educationLevel;
      const experienceJobRole = user.experienceDetails[0].jobRole;

      if (requiredEducationLevels.includes(educationLevel) && experienceJobRole === requiredJobRole) {
        const primarySkillMatchCount = user.skillsDetails.primarySkills.filter((skill) => requiredPrimarySkills.includes(skill)).length;
        const primarySkillPercentageMatch = (primarySkillMatchCount / requiredPrimarySkills.length) * 100;

        user.primarySkillPercentageMatch = primarySkillPercentageMatch;
        expertPool.push(user);
      }
    });

    const matchedUsers = {
      advancePool,
      proficientPool,
      expertPool,
    };
    const data = { matchedUsers };
    return res.status(200).json({ status: true, data, message: 'success' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
// const { EducationLevelPoints, AuthorityPoints, ExperienceLevelPoints } = require("../Constrains/authority.js");

// const PREP = async function (req, res) {
//   try {
//     const allUsers = await userModel.find({ recruiter: false, isDeleted: false }).lean();

//     const advancePool = [];
//     const proficientPool = [];
//     const expertPool = [];

//     await Promise.all(
//       allUsers.map(async (user) => {
//         const educationDetails = await educationModel.find({ userDetailsID: user._id }).lean();
//         const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).lean();
//         const skillsDetails = await skillsModel.findOne({ userDetailsID: user._id }).lean();
//         const projectDetails = await projectsModel.findOne({ userDetailsID: user._id }).lean();
//         const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

//         let score = 0;
//         let primarySkillPercentageMatch = 0;

//         // Calculate education, authority, and experience scores for each detail
//         educationDetails.forEach((education) => {
//           experienceDetails.forEach((experience) => {
//             const educationLevel = education.educationLevel;
//             const authority = education.authority;
//             const experienceValue = experience.experience;

//             const educationScore = EducationLevelPoints[educationLevel] || 0;
//             const authorityScore = AuthorityPoints[authority] || 0;
//             const experienceScore = ExperienceLevelPoints[experienceValue] || 0;

//             const detailScore = educationScore + authorityScore + experienceScore;

//             if (detailScore > score) {
//               score = detailScore;
//             }
//           });
//         });

//         // Calculate primary skill percentage match
//         if (skillsDetails && projectDetails && projectDetails.skills) {
//           const userSkills = skillsDetails.skills;
//           const projectSkills = projectDetails.skills;

//           const matchingSkills = userSkills.filter((skill) => projectSkills.includes(skill));
//           primarySkillPercentageMatch = (matchingSkills.length / projectSkills.length) * 100;
//         }

//         // Categorize users into pools
//         if (educationDetails.length > 0 && experienceDetails.length > 0) {
//           const authority = educationDetails[0].authority;
//           const experience = experienceDetails[0].experience;
//           const education = educationDetails[0].education;

//           if (
//             (authority === 'Central Govt' ||
//               authority === 'State Govt' ||
//               authority === 'Demeed University' ||
//               authority === 'Private') &&
//             (experience === 'Fresher' ||
//               experience === '1 Year' ||
//               experience === '2 Year')
//           ) {
//             advancePool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//               primarySkillPercentageMatch,
//             });
//           } else if (
//             (authority === 'IIT' ||
//               authority === 'IIM' ||
//               authority === 'IISc' ||
//               authority === 'NIT') &&
//             (experience === '3 Year' ||
//               experience === '4 Year' ||
//               experience === '5 Year')
//           ) {
//             proficientPool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//               primarySkillPercentageMatch,
//             });
//           } else if (
//             (authority === 'IIT' ||
//               authority === 'IIM' ||
//               authority === 'IISc' ||
//               authority === 'NIT' ||
//               authority === 'AIIMS' ||
//               authority === 'BITS' ||
//               authority === 'BITS' ||
//               authority === 'Private' ||
//               authority === 'Central Govt' ||
//               authority === 'State Govt' ||
//               authority === 'Demeed University') &&
//             (experience === '6 Year' ||
//               experience === '7 Year' ||
//               experience === '8 Year' ||
//               experience === '9 Year' ||
//               experience === '10 Year' ||
//               experience === '11 to 15 Year' ||
//               experience === '15 to 20 Year' ||
//               experience === '20+ Year')
//           ) {
//             expertPool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//               primarySkillPercentageMatch,
//             });
//           }
//         }
//       })
//     );

//     const categorizedData = {
//       advancePool,
//       proficientPool,
//       expertPool,
//     };
//     // Sort users within each pool based on hiRank (score) in descending order
//     advancePool.sort((a, b) => b.hiRank - a.hiRank);
//     proficientPool.sort((a, b) => b.hiRank - a.hiRank);
//     expertPool.sort((a, b) => b.hiRank - a.hiRank);

//     // Response object containing categorized data
//     const response = {
//       advancePool: [],
//       proficientPool: [],
//       expertPool: [],
//     };

//     // Iterate over advancePool and add primarySkillPercentageMatch to each user
//     response.advancePool = advancePool.map((user) => ({
//       ...user,
//       primarySkillPercentageMatch: user.primarySkillPercentageMatch,
//     }));

//     // Iterate over proficientPool and add primarySkillPercentageMatch to each user
//     response.proficientPool = proficientPool.map((user) => ({
//       ...user,
//       primarySkillPercentageMatch: user.primarySkillPercentageMatch,
//     }));

//     // Iterate over expertPool and add primarySkillPercentageMatch to each user
//     response.expertPool = expertPool.map((user) => ({
//       ...user,
//       primarySkillPercentageMatch: user.primarySkillPercentageMatch,
//     }));

//     return res.status(200).json({ status: true, message: "Categorized data", data: response });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };


// const PREP = async function (req, res) {
//   try {
//     const allUsers = await userModel.find({ recruiter: false, isDeleted: false }).lean();

//     const advancePool = [];
//     const proficientPool = [];
//     const expertPool = [];

//     await Promise.all(
//       allUsers.map(async (user) => {
//         const educationDetails = await educationModel.find({ userDetailsID: user._id }).lean();
//         const experienceDetails = await experienceModel.find({ userDetailsID: user._id }).lean();
//         const skillsDetails = await skillsModel.findOne({ userDetailsID: user._id }).lean();
//         const projectDetails = await projectsModel.findOne({ userDetailsID: user._id }).lean();
//         const userProfile = await userprofileModel.findOne({ userDetailsID: user._id }).lean();

//         let score = 0;

//         // Calculate score for each education and experience detail
//         educationDetails.forEach((education) => {
//           experienceDetails.forEach((experience) => {
//             const educationLevel = education.educationLevel;
//             const authority = education.authority;
//             const experienceValue = experience.experience;

//             const educationScore = EducationLevelPoints[educationLevel] || 0;
//             const authorityScore = AuthorityPoints[authority] || 0;
//             const experienceScore = ExperienceLevelPoints[experienceValue] || 0;

//             const detailScore = educationScore + authorityScore + experienceScore;

//             if (detailScore > score) {
//               score = detailScore;
//             }
//           });
//         });

//         // Calculate primary skill percentage match
//         const primarySkills = skillsDetails.primarySkills;
//         const userPrimarySkills = userProfile.primarySkills;
//         const primarySkillPercentageMatch = calculatePercentageMatch(primarySkills, userPrimarySkills);

//         // Categorize users into pools
//         if (educationDetails.length > 0 && experienceDetails.length > 0) {
//           const authority = educationDetails[0].authority;
//           const experience = experienceDetails[0].experience;
//           const education = educationDetails[0].education;

//           if (
//             (authority === 'Central Govt' ||
//               authority === 'State Govt' ||
//               authority === 'Demeed University' ||
//               authority === 'Private') &&
//             (experience === 'Fresher' ||
//               experience === '1 Year' ||
//               experience === '2 Year')
//           ) {
//             advancePool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//               primarySkillPercentageMatch,
//             });
//           } else if (
//             (authority === 'IIT' ||
//               authority === 'IIM' ||
//               authority === 'IISc' ||
//               authority === 'NIT') &&
//             (experience === '3 Year' ||
//               experience === '4 Year' ||
//               experience === '5 Year')
//           ) {
//             proficientPool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//               primarySkillPercentageMatch,
//             });
//           } else if (
//             (authority === 'IIT' ||
//               authority === 'IIM' ||
//               authority === 'IISc' ||
//               authority === 'NIT' ||
//               authority === 'Central Govt' ||
//               authority === 'State Govt' ||
//               authority === 'Demeed University' ||
//               authority === 'Private') &&
//             (experience === '6 Year' ||
//               experience === '7 Year' ||
//               experience === '8 Year' ||
//               experience === '9 Year' ||
//               experience === '10 Year' ||
//               experience === '11 to 15 Year' ||
//               experience === '15 to 20 Year' ||
//               experience === '20+ Year')
//           ) {
//             expertPool.push({
//               hiRank: score,
//               user,
//               educationDetails,
//               experienceDetails,
//               skillsDetails,
//               projectDetails,
//               userProfile,
//               primarySkillPercentageMatch,
//             });
//           }
//         }
//       })
//     );

// const categorizedData = {
//   advancePool,
//   proficientPool,
//   expertPool,
// };

//     // Rest of the code...

//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// // Helper function to calculate the percentage match between two arrays of skills
// // Helper function to calculate the percentage match between two arrays of skills
// function calculatePercentageMatch(skills1, skills2) {
//   if (!skills1 || !skills2 || skills1.length === 0 || skills2.length === 0) {
//     return 0; // Return 0 if either of the skills arrays is undefined or empty
//   }

//   const intersection = skills1.filter((skill) => skills2.includes(skill));
//   const percentageMatch = (intersection.length / skills1.length) * 100;
//   return Math.round(percentageMatch);
// }



module.exports = { recruiterInformation, recruiterInfo, updateRecruiterData, talentPool, recruiterSearch, searchJobseekerGeneral, jobSearch, deleteRecruiter, PREP, RevenuePlan, getRecruiterPlan };