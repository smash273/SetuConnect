const User = require('../models/User');
const Alumni = require('../models/Alumni');
const Event = require('../models/Event');
const Job = require('../models/Job');
const FundraisingCampaign = require('../models/FundraisingCampaign');
const ForumThread = require('../models/ForumThread');
const ForumComment = require('../models/ForumComment');
const Notification = require('../models/Notification');

// @desc    Get dashboard data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res, next) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const alumniCount = await Alumni.countDocuments();
    const eventCount = await Event.countDocuments();
    const jobCount = await Job.countDocuments();
    const campaignCount = await FundraisingCampaign.countDocuments();
    const threadCount = await ForumThread.countDocuments();
    const commentCount = await ForumComment.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    // Get recent events
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('organizer', 'name');

    // Get total funds raised
    const campaigns = await FundraisingCampaign.find();
    const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          alumni: alumniCount,
          events: eventCount,
          jobs: jobCount,
          campaigns: campaignCount,
          threads: threadCount,
          comments: commentCount,
        },
        totalRaised,
        recentUsers,
        recentEvents,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove associated data
    await Alumni.findOneAndDelete({ user: req.params.id });
    await Event.deleteMany({ organizer: req.params.id });
    await Job.deleteMany({ postedBy: req.params.id });
    await FundraisingCampaign.deleteMany({ organizer: req.params.id });
    await ForumThread.deleteMany({ author: req.params.id });
    await ForumComment.deleteMany({ author: req.params.id });

    await user.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all events
// @route   GET /api/admin/events
// @access  Private/Admin
exports.getEvents = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Approve event
// @route   PUT /api/admin/events/:id/approve
// @access  Private/Admin
exports.approveEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.isApproved = true;
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject event
// @route   PUT /api/admin/events/:id/reject
// @access  Private/Admin
exports.rejectEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.isApproved = false;
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getJobs = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Approve job
// @route   PUT /api/admin/jobs/:id/approve
// @access  Private/Admin
exports.approveJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.isApproved = true;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject job
// @route   PUT /api/admin/jobs/:id/reject
// @access  Private/Admin
exports.rejectJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.isApproved = false;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get forum reports
// @route   GET /api/admin/forum/reports
// @access  Private/Admin
exports.getForumReports = async (req, res, next) => {
  try {
    // In a real app, you would have a reports model
    // For now, we'll return an empty array
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve forum report
// @route   PUT /api/admin/forum/reports/:id/resolve
// @access  Private/Admin
exports.resolveForumReport = async (req, res, next) => {
  try {
    // In a real app, you would handle forum reports
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Report resolved',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    // Get user growth data
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get event participation data
    const eventParticipation = await Event.aggregate([
      {
        $project: {
          month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          attendeeCount: { $size: '$attendees' },
        },
      },
      {
        $group: {
          _id: '$month',
          totalAttendees: { $sum: '$attendeeCount' },
          eventCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get fundraising data
    const fundraisingData = await FundraisingCampaign.aggregate([
      {
        $project: {
          month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          raised: 1,
          goal: 1,
        },
      },
      {
        $group: {
          _id: '$month',
          totalRaised: { $sum: '$raised' },
          totalGoal: { $sum: '$goal' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        eventParticipation,
        fundraisingData,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSystemSettings = async (req, res, next) => {
  try {
    // In a real app, you would have a settings model
    // For now, we'll return default settings
    res.status(200).json({
      success: true,
      data: {
        siteName: 'SetuConnect',
        siteDescription: 'Alumni Engagement Platform',
        allowRegistration: true,
        requireEmailVerification: true,
        maxFileSize: 5242880, // 5MB in bytes
        supportedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSystemSettings = async (req, res, next) => {
  try {
    // In a real app, you would update settings in the database
    // For now, we'll just return the updated settings
    res.status(200).json({
      success: true,
      data: req.body,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
exports.sendNotification = async (req, res, next) => {
  try {
    const { title, message, recipients } = req.body;

    // Create notifications for all recipients
    const notifications = recipients.map(recipient => ({
      recipient,
      sender: req.user.id,
      type: 'system',
      title,
      message,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
    });
  } catch (err) {
    next(err);
  }
};