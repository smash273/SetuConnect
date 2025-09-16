const mongoose = require('mongoose');

const fundraisingCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  goal: {
    type: Number,
    required: [true, 'Please add a goal amount'],
  },
  raised: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Scholarships', 'Facilities', 'Research', 'Athletics', 'Other'],
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
  },
  image: {
    type: String,
    default: '',
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  donations: [{
    donor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FundraisingCampaign', fundraisingCampaignSchema);