const Event = require('../models/Event');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');
const { sendEventNotification } = require('../services/notificationService');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name profilePhoto');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res, next) => {
  try {
    // Add organizer to req.body
    req.body.organizer = req.user.id;

    const event = await Event.create(req.body);

    // Send notification to all users (in a real app, you might want to target specific users)
    // sendEventNotification(event);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Make sure user is event organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Make sure user is event organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this event' });
    }

    await event.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event requires registration
    if (!event.registrationRequired) {
      return res.status(400).json({ message: 'This event does not require registration' });
    }

    // Check if user is already registered
    const isRegistered = event.attendees.some(
      attendee => attendee.user.toString() === req.user.id
    );

    if (isRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Check if event has max attendees limit
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Add user to attendees
    event.attendees.push({
      user: req.user.id,
      registeredAt: Date.now(),
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unregister from event
// @route   POST /api/events/:id/unregister
// @access  Private
exports.unregisterFromEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is registered
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === req.user.id
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    // Remove user from attendees
    event.attendees.splice(attendeeIndex, 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event',
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Private
exports.getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate({
      path: 'attendees.user',
      select: 'name profilePhoto graduationYear',
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      count: event.attendees.length,
      data: event.attendees,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Private
exports.getUpcomingEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
    })
      .populate('organizer', 'name profilePhoto')
      .sort({ date: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve event
// @route   PUT /api/events/:id/approve
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
// @route   PUT /api/events/:id/reject
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