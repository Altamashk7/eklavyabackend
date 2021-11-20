const { Mentor } = require("../models/mentor");
const { Invite } = require("../models/invite");
const { Answer } = require("../models/answer");
const express = require("express");
const { Meeting } = require("../models/meeting");
const { Question } = require("../models/question");
const router = express.Router();
const mongoose = require("mongoose");
router.get(`/`, async (req, res) => {
  const mentorList = await Mentor.find().select("-password");
  if (!mentorList) {
    res.json({ success: false });
  }
  res.send(mentorList);
});

router.get("/:id", async (req, res) => {
  const mentor = await Mentor.findById(req.params.id).select("-password");

  if (!mentor) {
    res.json({ message: "The Mentor with the given ID was not found." });
  }
  res.send(mentor);
});

router.get("/invite/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentee: req.params.id };
  }
  const inviteList = await Invite.find(filter).sort({ date: -1 });
  if (!inviteList) {
    res.json({ success: false });
  }
  res.send(inviteList);
});

router.get("/meeting/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentee: req.params.id };
  }
  const meetingList = await Meeting.find(filter).sort({ date: -1 });
  if (!meetingList) {
    res.json({ success: false });
  }
  res.send(meetingList);
});

router.get("/question/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { askedby: req.params.id };
  }
  const questionList = await Question.find(filter).sort({ date: -1 });
  if (!questionList) {
    res.json({ success: false });
  }
  res.send(questionList);
});

router.get("/answer/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { answeredby: req.params.id };
  }
  const answerList = await Question.find(filter).sort({ date: -1 });
  if (!answerList) {
    res.json({ success: false });
  }
  res.send(answerList);
});

router.post("/meeting/:id", async (req, res) => {
  const menteeid = mongoose.Types.ObjectId(req.body.mentee);
  const mentorid = mongoose.Types.ObjectId(req.params.id);

  let meeting = new Meeting({
    message: req.body.message,
    mentee: menteeid,
    mentor: mentorid,
    date: req.body.date,
    url: req.body.url,
  });
  meeting = await meeting.save();
  if (!meeting) return res.send("the Meeting cannot be created!");

  res.send(meeting);
});

router.post("/invite/:id", async (req, res) => {
  const menteeid = mongoose.Types.ObjectId(req.body.mentee);
  const mentorid = mongoose.Types.ObjectId(req.params.id);

  const today = Date.now();
  let invite = new Invite({
    message: req.body.message,
    mentee: menteeid,
    mentor: mentorid,
    date: today,
  });
  invite = await invite.save();
  if (!invite) return res.send("the Invite cannot be created!");
  res.send(invite);
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const categoryid = mongoose.Types.ObjectId(req.body.category);
  let mentor = new Mentor({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    profileurl: req.body.profileurl,
    category: categoryid,
  });
  mentor = await mentor.save();
  if (!mentor) return res.send("the mentor cannot be created!");
  res.status(200).send(mentor);
});

router.put("/invite/accept/:id", async (req, res) => {
  const mentorid = mongoose.Types.ObjectId(req.params.id);
  const mentorobj = await Mentor.findById(mentorid);
  const menteeArray = menteeobj.mentee;

  menteeArray.push(mongoose.Types.ObjectId(req.body.mentee));
  let params = {
    mentees: menteeArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  const menteeid = mongoose.Types.ObjectId(req.body.menteeid);
  const menteeobj = await Mentee.findById(menteeid);
  const mentorArray = menteeobj.mentors;
  mentorArray.push(req.params.id);
  params = {
    mentors: mentorArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentee = await Mentee.findByIdAndUpdate(menteeid, params, {
    new: true,
  });

  try {
    const inviteid = mongoose.Types.ObjectId(req.body.invite);
    const invite = await Invite.findByIdAndDelete(inviteid);
    if (!invite) {
      return res.status(404).send();
    }
    res.send("invite accepted");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/meeting/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentee: req.params.id };
  }
  const meetingList = await Meeting.find(filter).sort({ date: -1 });
  if (!meetingList) {
    res.json({ success: false });
  }
  res.send(meetingList);
});

//for profile
router.put("/:id", async (req, res) => {
  // console.log(req.body);
  let params = {
    email: req.body.email,
    name: req.body.name,
    qualifications: req.body.a,
    profileHeading: req.body.a,
    profileDescription: req.body.profileDescription,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];

  const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  if (!mentor) return res.send("the mentor cannot be updated!");
  res.send(mentor);
});
// for skills
router.put("/skills/:id", async (req, res) => {
  const mentorA = await Mentor.findById(req.params.id);
  const skillsArray = mentorA.skilla;
  skillsArray.push(req.body.skills);
  let params = {
    skills: skillsArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });
  if (!mentor) return res.send("the skills cannot be updated!");
  res.send(mentor);
});
// for achievements
router.put("/achievements/:id", async (req, res) => {
  const mentorA = await Mentor.findById(req.params.id);
  const achievementsArray = mentorA.achivemenets;
  achievementsArray.push(req.body.achivemenets);
  let params = {
    achivemenets: achievementsArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });
  if (!mentor) return res.send("the skills cannot be updated!");
  res.send(mentor);
});

router.put("/badges/:id", async (req, res) => {
  const mentorA = await Mentor.findById(req.params.id);
  const badgesArray = mentorA.badges;
  badgesArray.push(req.body.badges);
  let params = {
    badges: badgesArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });
  if (!mentor) return res.send("the badges cannot be updated!");
  res.send(mentor);
});

//answer
router.post("/answers/:id", async (req, res) => {
  const mentorid = mongoose.Types.ObjectId(req.params.id);

  let answer = new Answer({
    answer: req.body.answer,

    answeredby: mentorid,

    date: req.body.date,
  });
  answer = await answer.save();
  if (!answer) return res.send("the answer cannot be created!");
  else {
    const answerid = answer._id;
    const questionid = mongoose.Types.ObjectId(req.body.question);

    const question = await Question.findById(questionid);

    const answerArray = question.answers;
    answerArray.push(answerid);
    let params = {
      answers: answerArray,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];
    const questiona = await Question.findByIdAndUpdate(questionid, params, {
      new: true,
    });
    if (!questiona) return res.send("the badges cannot be updated!");

    res.send(answer);
  }
});

router.post("/question/:id", async (req, res) => {
  const mentorid = mongoose.Types.ObjectId(req.params.id);
  const categoryid = mongoose.Types.ObjectId(req.body.category);
  const today = Date.now();
  let question = new Question({
    question: req.body.question,
    askedby: mentorid,
    category: categoryid,
    date: today,
  });
  question = await question.save();
  if (!question) return res.send("the answer cannot be created!");

  res.send(question);
});
module.exports = router;
