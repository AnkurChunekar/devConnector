const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: String,
  website: String,
  location: String,
  status: { type: String, required: true },
  skills: { type: [String], required: true },
  bio: String,
  githubUsername: String,
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: String,
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false },
      description: String,
    },
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String, required: true },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false },
      description: String,
    },
  ],
  social: {
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    youtube: String,
  },
  date: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
