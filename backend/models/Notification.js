const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: [true, 'Please add a notification type'],
    enum: [
      'event_reminder',
      'event_update',
      'job_application',
      'mentorship_request',
      'mentorship_accepted',
      'mentorship_declined',
      'donation_received',
      'forum_reply',
      'message',
      'connection_request',
      'system',
    ],
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  relatedId: {
    type: mongoose.Schema.ObjectId,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);