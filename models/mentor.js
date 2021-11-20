const mongoose = require("mongoose");

const mentorSchema = mongoose.Schema({
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
  profileurl: {
    type: String,
    required: true,
  },

  mentees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
    },
  ],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
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
  achievements: [
    {
      type: String,
    },
  ],

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
          ref: "Mentee",
        },
      ],
    },
  ],

  review: [
    {
      message: {
        type: String,
      },
      mentee: {
        type: mongoose.Schema.Types.ObjectId,
      },
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

exports.Mentor = mongoose.model("Mentor", mentorSchema);