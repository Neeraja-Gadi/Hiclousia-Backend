require('dotenv').config();

const express = require('express');

const router = express.Router();

const userController = require("../Controllers/userController");
const infoController=require("../Controllers/infoController");
const jobController=require("../Controllers/jobController");
const recruiterController = require("../Controllers/recruiterController");



router.post('/userProfile', userController.userGeneral);//s3 post request
router.post("/create",userController.register);
router.post("/login",userController.loginUser);
router.post("/experience",infoController.experienceInfo);
router.post("/education",infoController.educationInfo);
router.post("/project",infoController.projectInfo);
router.post("/skill",infoController.skillsInfo);
router.post("/job/:id",jobController.jobInfo);
router.post("/recruiter",recruiterController.recruiterInfo);
router.post("/revenueR",recruiterController.RevenuePlan);
//******************************************************* */

router.put("/userProfile/:id", userController.updateuserProfile);
router.put("/experience/:id",infoController.updateExperienceData);
router.put("/education/:id",infoController.updateEducationData);
router.put("/skill/:id",infoController.updateSkillsData);
router.put("/job/:id",jobController.updateJobData);
router.put("/recruiter/:id",recruiterController.updateRecruiterData);

//********************************************************** *
router.get("/userProfile/:id",userController.getUserProfileById); //get UserProfile info from req.params.id
router.get("/education/:id",infoController.educationInformation);//get education info from req.params.id
router.get("/project/:id",infoController.projectInformation);//get project info from req.params.id
router.get("/skills/:id",infoController.skillsInformation);//get skills info from req.params.id
router.get("/experience/:id",infoController.experienceInformation);//get experience info from req.params.id
router.get("/personal/:id",infoController.personalInfo);//get personal info from req.params.id
router.get("/recruiter/:id",recruiterController.recruiterInformation);//get recruiter info from req.params.id
router.get("/jobpostbyRecruiter/:id",jobController.jobpostbyRecruiter);//get jobpost info from req.params.id
// ********************************************************************************************************************
router.get("/job",jobController.searchJobs); //general job search for user or jobseeker
router.get("/allusers",recruiterController.recruiterSearch); // multiple search for recruiter
router.get("/allrecruiter",recruiterController.searchJobseekerGeneral);// general recruiter search for candidate
router.get("/talentPool",recruiterController.talentPool); //TalentPool based search for Recruiter
router.get("/jobsearch/:id",recruiterController.jobSearch); //exact candi match with jd by id & percentile match {indirect}
router.get('/postbyrecruiter/:id', userController.findJobMatches);//user details based job recommendations
router.get('/PREP/:id', recruiterController.PREP);
router.get('/revenueR/:userDetailsID',recruiterController.getRecruiterPlan);
//********************************************************************************************************************

// Define routes for the delete API
router.delete('/Education/:id', infoController.deleteEducation);
router.delete('/Experience/:id', infoController.deleteExperience);
router.delete('/Projects/:id', infoController.deleteProject);
router.delete('/Skills/:id', infoController.deleteSkills);
router.delete('/Recruiter/:id', recruiterController.deleteRecruiter);
router.delete('/Jobs/:id', jobController.deleteJob);
router.delete('/userProfile/:id', userController.deleteuserProfile);

// ********************************************************S3***Bucket********************************************************

// router.post('/forgot-password', userController.requestPasswordReset);
// router.post('/reset-password', userController.resetPassword);
// router.post("/forgot-password", async (req, res) => {
//     try {
//       const { email } = req.body;
  
//       const user = await userModel.findOne({ email });
  
//       if (!user) {
//         return res.status(404).send({ status: false, message: "User not found" });
//       }
  
//       const resetToken = crypto.randomBytes(20).toString("hex");
//       user.resetLink.data = resetToken;
//       await user.save();
  
//       // Send the reset token to the user's email address
//       await sendResetEmail(email, resetToken);
  
//       res.status(200).send({ status: true, message: "Password reset link sent" });
//     } catch (err) {
//       res.status(500).send({ status: false, message: err.message });
//     }
//   });
  
//   // Route for resetting the password
//   router.post("/reset-password", async (req, res) => {
//     try {
//       const { resetToken, newPassword } = req.body;
  
//       const user = await userModel.findOne({ "resetLink.data": resetToken });
  
//       if (!user) {
//         return res.status(404).send({ status: false, message: "Invalid reset token" });
//       }
  
//       user.password = newPassword;
//       user.resetLink.data = '';
//       await user.save();
  
//       res.status(200).send({ status: true, message: "Password reset successful" });
//     } catch (err) {
//       res.status(500).send({ status: false, message: err.message });
//     }
//   });
module.exports = router;