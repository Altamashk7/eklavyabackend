const mongoose = require("mongoose");

const menteeSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,

    required: true,
  },
  qualifications: {
    type: String,
    default: "",
  },
  mentors: [
    {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentee",
      },
    },
  ],
  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
    },
  ],
  profileHeading: {
    type: String,
  },
  profileDescription: {
    type: String,
  },
  achievements: {
    type: String,
  },
  skills: [
    {
      name: {
        type: String,
      },
      endorseCount: {
        type: Number,
        default: 0,
      },
      endorseBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mentor",
        },
      ],
    },
  ],

  review: [
    {
      message: {
        type: String,
      },
      mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
      },
    },
  ],

  meetings: [
    {
      mentee: {
        type: mongoose.Schema.Types.ObjectId,
      },
      url: {
        type: String,
      },
      date: {
        type: Date,
      },
    },
  ],

  mentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],

  resume: {
    type: Object,
  },
  totalCoins: {
    current: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
});

exports.Mentee = mongoose.model("Mentee", menteeSchema);
