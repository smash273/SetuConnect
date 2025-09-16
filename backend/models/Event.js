const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  time: {
    type: String,
    required: [true, 'Please add a time'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  virtualEvent: {
    type: Boolean,
    default: false,
  },
  eventLink: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Social', 'Career', 'Professional Development', 'Fundraising', 'Mentorship', 'Other'],
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  attendees: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  maxAttendees: {
    type: Number,
  },
  registrationRequired: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', eventSchema);