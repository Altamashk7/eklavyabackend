const { Mentor } = require("../models/mentor");
const { Mentee } = require("../models/mentee");
const { Category } = require("../models/category");
const { Invite } = require("../models/invite");
const { Answer } = require("../models/answer");

const express = require("express");
const { Meeting } = require("../models/meeting");
const { Question } = require("../models/question");
const router = express.Router();
const mongoose = require("mongoose");
const { Badge } = require("../models/badge");
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

router.get("/badges/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentor: req.params.id };
  }
  const BadgeList = await Badge.find(filter).sort({ date: -1 });
  if (!BadgeList) {
    res.json({ success: false });
  }
  res.send(BadgesList);
});

router.get("/invite/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentor: req.params.id };
  }
  const inviteList = await Invite.find(filter).sort({ date: -1 });
  if (!inviteList) {
    res.json({ success: false });
  }
  res.send(inviteList);
});

router.get(`/mentee/:id`, async (req, res) => {
  Mentor.findOne({ _id: req.params.id })
    .populate("mentees") // key to populate
    .then((user) => {
      res.json(user);
    });
});

router.get("/meeting/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentor: req.params.id };
  }
  const meetingList = await Meeting.find(filter).sort({ date: -1 });
  if (!meetingList) {
    res.json({ success: false });
  }
  res.send(meetingList);
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
router.post("/category", async (req, res) => {
  let category = new Category({
    name: req.body.name,
  });
  category = await category.save();
  if (!category) return res.send("the category cannot be created!");

  res.send(category);
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

// router.post("/invite/:id", async (req, res) => {
//   const menteeid = mongoose.Types.ObjectId(req.body.mentee);
//   const mentorid = mongoose.Types.ObjectId(req.params.id);

//   const today = Date.now();
//   let invite = new Invite({
//     message: req.body.message,
//     mentee: menteeid,
//     mentor: mentorid,
//     date: today,
//   });
//   invite = await invite.save();
//   if (!invite) return res.send("the Invite cannot be created!");
//   res.send(invite);
// });

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
  const inviteid = mongoose.Types.ObjectId(req.body.invite);
  const inviteis = await Invite.findById(inviteid);
  const mentorid = mongoose.Types.ObjectId(req.params.id);
  const mentorobj = await Mentor.findById(mentorid);
  const menteeArray = mentorobj.mentees;

  menteeArray.push(mongoose.Types.ObjectId(req.body.mentee));
  let params = {
    mentees: menteeArray,
  };

  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  const menteeid = mongoose.Types.ObjectId(inviteis.mentee);
  const menteeobj = await Mentee.findById(menteeid);
  const mentorArray = menteeobj.mentors;
  const objofmetee = {
    category: mongoose.Types.ObjectId(mentorobj.category),
    mentor: menteeid,
  };

  mentorArray.push(objofmetee);
  params = {
    mentors: mentorArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentee = await Mentee.findByIdAndUpdate(menteeid, params, {
    new: true,
  });

  try {
    const invite = await Invite.findByIdAndDelete(inviteid);
    if (!invite) {
      return res.status(404).send();
    }
    res.send("invite accepted");
  } catch (error) {
    res.status(500).send(error);
  }
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

router.post("/badges/:id", async (req, res) => {
  const mentorid = mongoose.Types.ObjectId(req.params.id);
  const mentorobj = await Mentor.findById(mentorid);
  const coins = mentorobj.totalCoins;

  if (coins.current - req.body.value > 0) {
    coins.current = coins.current - req.body.value;

    let params = {
      totalCoins: coins,
    };

    for (let prop in params) if (!params[prop]) delete params[prop];
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
      new: true,
    });

    const today = Date.now();
    let badge = new Badge({
      name: req.body.question,
      description: req.body.description,
      value: req.body.value,
      mentor: req.body.params,
      date: today,
    });
    badge = await badge.save();
    if (!badge) return res.send("the answer cannot be created!");
    res.send(badge);
  } else res.send("Not enough coins");
});

router.put("/badges/:id", async (req, res) => {
  const badgeid = mongoose.Types.ObjectId(req.body.badge);
  const badgeobj = await Badge.findById(badgeid);
  const value = badgeobj.value;
  const menteeid = mongoose.Types.ObjectId(req.body.mentee);
  const menteeobj = await Mentee.findById(menteeid);
  const coins = menteeobj.totalCoins;
  coins.current = coins.current + value;
  coins.total = coins.total + value;

  let params = {
    totalCoins: coins,
  };

  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentee = await Mentee.findByIdAndUpdate(menteeid, params, {
    new: true,
  });

  params = {
    mentee: menteeid,
  };

  for (let prop in params) if (!params[prop]) delete params[prop];
  const badge = await Badge.findByIdAndUpdate(badgeid, params, {
    new: true,
  });

  if (!badge) return res.send("the answer cannot be created!");
  res.send(mentee);
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

router.put("/:id", async (req, res) => {
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

module.exports = router;
