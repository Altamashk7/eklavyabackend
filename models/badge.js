const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: { type: String },
  image: {
    data: Buffer,
    contentType: String,
  },

  value: { type: Number },
});

exports.Badge = mongoose.model("Badge", badgeSchema);
