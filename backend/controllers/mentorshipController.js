const Alumni = require('../models/Alumni');
const { MentorshipRequest, MentorshipConnection } = require('../models/Mentorship');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

// @desc    Get all mentors
// @route   GET /api/mentorship/mentors
// @access  Private
exports.getMentors = async (req, res, next) => {
  try {
    // Find alumni who are mentors
    const mentors = await Alumni.find({ 'mentorship.isMentor': true })
      .populate({
        path: 'user',
        select: 'name profilePhoto graduationYear degree location jobTitle company skills',
      })
      .sort({ 'mentorship.rating': -1 });

    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single mentor
// @route   GET /api/mentorship/mentors/:id
// @access  Private
exports.getMentor = async (req, res, next) => {
  try {
    const mentor = await Alumni.findOne({
      user: req.params.id,
      'mentorship.isMentor': true,
    }).populate({
      path: 'user',
      select: 'name profilePhoto graduationYear degree location jobTitle company skills interests bio',
    });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.status(200).json({
      success: true,
      data: mentor,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Become a mentor
// @route   POST /api/mentorship/become-mentor
// @access  Private
exports.becomeMentor = async (req, res, next) => {
  try {
    // Check if user already has an alumni profile
    let alumni = await Alumni.findOne({ user: req.user.id });

    if (!alumni) {
      return res.status(404).json({ message: 'Please create an alumni profile first' });
    }

    // Update alumni profile to become a mentor
    alumni.mentorship.isMentor = true;
    alumni.mentorship.expertise = req.body.expertise || [];
    alumni.mentorship.mentorshipAreas = req.body.mentorshipAreas || [];
    alumni.mentorship.availability = req.body.availability || 'Flexible';
    alumni.mentorship.maxMentees = req.body.maxMentees || 3;

    await alumni.save();

    res.status(200).json({
      success: true,
      data: alumni,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update mentor profile
// @route   PUT /api/mentorship/mentors/:id
// @access  Private
exports.updateMentorProfile = async (req, res, next) => {
  try {
    let alumni = await Alumni.findOne({
      user: req.params.id,
      'mentorship.isMentor': true,
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Make sure user is mentor
    if (alumni.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this mentor profile' });
    }

    // Update mentorship information
    alumni.mentorship = {
      ...alumni.mentorship,
      ...req.body.mentorship,
    };

    await alumni.save();

    res.status(200).json({
      success: true,
      data: alumni,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request mentorship
// @route   POST /api/mentorship/mentors/:id/request
// @access  Private
exports.requestMentorship = async (req, res, next) => {
  try {
    const alumni = await Alumni.findOne({
      user: req.params.id,
      'mentorship.isMentor': true,
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    if (alumni.mentorship.currentMentees >= alumni.mentorship.maxMentees) {
      return res.status(400).json({ message: 'This mentor has reached maximum capacity' });
    }

    // Check if request already exists
    const existingRequest = await MentorshipRequest.findOne({
      mentor: req.params.id,
      mentee: req.user.id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Mentorship request already exists' });
    }

    // Create mentorship request
    const mentorshipRequest = await MentorshipRequest.create({
      mentor: req.params.id,
      mentee: req.user.id,
      message: req.body.message,
    });

    res.status(201).json({
      success: true,
      data: mentorshipRequest,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Respond to mentorship request
// @route   PUT /api/mentorship/requests/:id/respond
// @access  Private
exports.respondToMentorshipRequest = async (req, res, next) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }

    // Make sure user is the mentor
    if (request.mentor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to respond to this request' });
    }

    // Update request status
    request.status = req.body.status;
    request.responseMessage = req.body.responseMessage;
    await request.save();

    // If accepted, create mentorship connection
    if (req.body.status === 'accepted') {
      // Get alumni profile
      const alumni = await Alumni.findOne({ user: req.user.id });
      
      // Increment current mentees count
      alumni.mentorship.currentMentees += 1;
      await alumni.save();

      // Create mentorship connection
      await MentorshipConnection.create({
        mentor: req.user.id,
        mentee: request.mentee,
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get mentorship requests
// @route   GET /api/mentorship/requests
// @access  Private
exports.getMentorshipRequests = async (req, res, next) => {
  try {
    const requests = await MentorshipRequest.find({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id },
      ],
    })
      .populate('mentor', 'name profilePhoto')
      .populate('mentee', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get mentorship connections
// @route   GET /api/mentorship/connections
// @access  Private
exports.getMentorshipConnections = async (req, res, next) => {
  try {
    const connections = await MentorshipConnection.find({
      $or: [
        { mentor: req.user.id },
        { mentee: req.user.id },
      ],
    })
      .populate('mentor', 'name profilePhoto')
      .populate('mentee', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: connections.length,
      data: connections,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add mentorship meeting
// @route   POST /api/mentorship/connections/:id/meetings
// @access  Private
exports.addMentorshipMeeting = async (req, res, next) => {
  try {
    const connection = await MentorshipConnection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Mentorship connection not found' });
    }

    // Make sure user is part of the connection
    if (
      connection.mentor.toString() !== req.user.id &&
      connection.mentee.toString() !== req.user.id
    ) {
      return res.status(401).json({ message: 'Not authorized to add meeting to this connection' });
    }

    connection.meetings.push(req.body);
    await connection.save();

    res.status(200).json({
      success: true,
      data: connection,
    });
  } catch (err) {
    next(err);
  }
};