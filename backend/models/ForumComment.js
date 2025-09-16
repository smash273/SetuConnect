const mongoose = require('mongoose');

const forumCommentSchema = new mongoose.Schema({
  thread: {
    type: mongoose.Schema.ObjectId,
    ref: 'ForumThread',
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  parentComment: {
    type: mongoose.Schema.ObjectId,
    ref: 'ForumComment',
    default: null,
  },
  likes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  }],
  isEdited: {
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

forumCommentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ForumComment', forumCommentSchema);