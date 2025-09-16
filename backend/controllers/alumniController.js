const User = require('../models/User');
const Alumni = require('../models/Alumni');
const { MentorshipRequest, MentorshipConnection } = require('../models/Mentorship');

// @desc    Get all alumni
// @route   GET /api/alumni
// @access  Private
exports.getAllAlumni = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single alumni
// @route   GET /api/alumni/:id
// @access  Private
exports.getAlumniById = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id).populate({
      path: 'user',
      select: 'name email profilePhoto graduationYear degree location jobTitle company skills interests',
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.status(200).json({
      success: true,
      data: alumni,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create alumni profile
// @route   POST /api/alumni
// @access  Private
exports.createAlumni = async (req, res, next) => {
  try {
    const existingAlumni = await Alumni.findOne({ user: req.user.id });
    if (existingAlumni) {
      return res.status(400).json({ message: 'User already has an alumni profile' });
    }

    req.body.user = req.user.id;
    const alumni = await Alumni.create(req.body);

    res.status(201).json({
      success: true,
      data: alumni,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update alumni profile
// @route   PUT /api/alumni/:id
// @access  Private
exports.updateAlumni = async (req, res, next) => {
  try {
    let alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });

    if (alumni.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this alumni profile' });
    }

    alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: alumni });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete alumni profile
// @route   DELETE /api/alumni/:id
// @access  Private
exports.deleteAlumni = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });

    if (alumni.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this alumni profile' });
    }

    await alumni.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Search alumni
// @route   GET /api/alumni/search
// @access  Private
exports.searchAlumni = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Please provide a search query' });

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { skills: { $regex: query, $options: 'i' } },
        { interests: { $regex: query, $options: 'i' } },
        { jobTitle: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
      ],
    }).select('_id name profilePhoto graduationYear degree location jobTitle company skills interests');

    const userIds = users.map(user => user._id);
    const alumni = await Alumni.find({ user: { $in: userIds } }).populate('user');

    res.status(200).json({ success: true, count: alumni.length, data: alumni });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured alumni
// @route   GET /api/alumni/featured
// @access  Public
exports.getFeaturedAlumni = async (req, res, next) => {
  try {
    const alumni = await Alumni.find({ isFeatured: true })
      .populate({ path: 'user', select: 'name profilePhoto graduationYear degree location jobTitle company' })
      .limit(6);

    res.status(200).json({ success: true, count: alumni.length, data: alumni });
  } catch (err) {
    next(err);
  }
};

// @desc    Become a mentor
// @route   PUT /api/alumni/:id/mentor
// @access  Private
exports.becomeMentor = async (req, res, next) => {
  try {
    let alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });

    if (alumni.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this alumni profile' });
    }

    alumni.mentorship.isMentor = true;
    alumni.mentorship.expertise = req.body.expertise || [];
    alumni.mentorship.mentorshipAreas = req.body.mentorshipAreas || [];
    alumni.mentorship.availability = req.body.availability || 'Flexible';
    alumni.mentorship.maxMentees = req.body.maxMentees || 3;

    await alumni.save();
    res.status(200).json({ success: true, data: alumni });
  } catch (err) {
    next(err);
  }
};

// @desc    Request mentorship
// @route   POST /api/alumni/:id/request-mentorship
// @access  Private
exports.requestMentorship = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });

    if (!alumni.mentorship.isMentor) {
      return res.status(400).json({ message: 'This alumni is not available for mentorship' });
    }

    if (alumni.mentorship.currentMentees >= alumni.mentorship.maxMentees) {
      return res.status(400).json({ message: 'This mentor has reached maximum capacity' });
    }

    const existingRequest = await MentorshipRequest.findOne({
      mentor: alumni.user,
      mentee: req.user.id,
      status: 'pending',
    });

    if (existingRequest) return res.status(400).json({ message: 'Mentorship request already exists' });

    const mentorshipRequest = await MentorshipRequest.create({
      mentor: alumni.user,
      mentee: req.user.id,
      message: req.body.message,
    });

    res.status(201).json({ success: true, data: mentorshipRequest });
  } catch (err) {
    next(err);
  }
};

// @desc    Respond to mentorship request
// @route   PUT /api/alumni/mentorship/requests/:id/respond
// @access  Private
exports.respondToMentorshipRequest = async (req, res, next) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Mentorship request not found' });

    if (request.mentor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to respond to this request' });
    }

    request.status = req.body.status;
    request.responseMessage = req.body.responseMessage;
    await request.save();

    if (req.body.status === 'accepted') {
      const alumni = await Alumni.findOne({ user: req.user.id });
      alumni.mentorship.currentMentees += 1;
      await alumni.save();

      await MentorshipConnection.create({ mentor: req.user.id, mentee: request.mentee });
    }

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};

// @desc    Get mentorship requests
// @route   GET /api/alumni/mentorship/requests
// @access  Private
exports.getMentorshipRequests = async (req, res, next) => {
  try {
    const requests = await MentorshipRequest.find({
      $or: [{ mentor: req.user.id }, { mentee: req.user.id }],
    })
      .populate('mentor', 'name profilePhoto')
      .populate('mentee', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    next(err);
  }
};

// @desc    Get mentorship connections
// @route   GET /api/alumni/mentorship/connections
// @access  Private
exports.getMentorshipConnections = async (req, res, next) => {
  try {
    const connections = await MentorshipConnection.find({
      $or: [{ mentor: req.user.id }, { mentee: req.user.id }],
    })
      .populate('mentor', 'name profilePhoto')
      .populate('mentee', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: connections.length, data: connections });
  } catch (err) {
    next(err);
  }
};

// @desc    Add mentorship meeting
// @route   POST /api/alumni/mentorship/connections/:id/meetings
// @access  Private
exports.addMentorshipMeeting = async (req, res, next) => {
  try {
    const connection = await MentorshipConnection.findById(req.params.id);
    if (!connection) return res.status(404).json({ message: 'Mentorship connection not found' });

    if (connection.mentor.toString() !== req.user.id && connection.mentee.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to add meeting to this connection' });
    }

    connection.meetings.push(req.body);
    await connection.save();

    res.status(200).json({ success: true, data: connection });
  } catch (err) {
    next(err);
  }
};
