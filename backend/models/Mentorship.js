const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  mentee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  responseMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const mentorshipConnectionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  mentee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  meetings: [{
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  MentorshipRequest: mongoose.model('MentorshipRequest', mentorshipRequestSchema),
  MentorshipConnection: mongoose.model('MentorshipConnection', mentorshipConnectionSchema),
};