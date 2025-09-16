const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  company: {
    type: String,
    required: [true, 'Please add a company'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  type: {
    type: String,
    required: [true, 'Please add a job type'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
  },
  salary: {
    type: String,
  },
  experience: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
  },
  skills: [String],
  applicationUrl: {
    type: String,
  },
  applicationEmail: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);