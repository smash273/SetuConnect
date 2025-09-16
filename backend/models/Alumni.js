const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  industry: {
    type: String,
    required: [true, 'Please add an industry'],
  },
  experience: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    required: [true, 'Please add experience level'],
  },
  achievements: [String],
  publications: [String],
  mentorship: {
    isMentor: {
      type: Boolean,
      default: false,
    },
    expertise: [String],
    mentorshipAreas: [String],
    availability: {
      type: String,
      enum: ['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekends', 'Flexible'],
    },
    maxMentees: {
      type: Number,
      default: 3,
    },
    currentMentees: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [{
      reviewer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alumni', alumniSchema);