const mongoose = require('mongoose');

const forumThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Mentorship', 'Events', 'Career Advice', 'Job Postings', 'Announcements', 'Other'],
  },
  tags: [String],
  likes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  }],
  savedBy: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  }],
  views: {
    type: Number,
    default: 0,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

forumThreadSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ForumThread', forumThreadSchema);