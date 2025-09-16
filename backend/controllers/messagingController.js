const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get conversations
// @route   GET /api/messaging/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate('participants', 'name profilePhoto')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single conversation
// @route   GET /api/messaging/conversations/:id
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name profilePhoto')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(401).json({ message: 'Not authorized to access this conversation' });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create conversation
// @route   POST /api/messaging/conversations
// @access  Private
exports.createConversation = async (req, res, next) => {
  try {
    const { participantIds, isGroup, name, description } = req.body;

    // Add current user to participants
    const allParticipants = [req.user.id, ...participantIds];

    // Check if conversation already exists (for direct messages)
    if (!isGroup && participantIds.length === 1) {
      const existingConversation = await Conversation.findOne({
        participants: { $all: allParticipants, $size: 2 },
        isGroup: false,
      });

      if (existingConversation) {
        return res.status(200).json({
          success: true,
          data: existingConversation,
        });
      }
    }

    // Create conversation
    const conversation = await Conversation.create({
      participants: allParticipants,
      isGroup,
      name,
      description,
      admin: req.user.id,
    });

    // Populate participants
    await conversation.populate('participants', 'name profilePhoto');

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get messages
// @route   GET /api/messaging/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some(p => p.toString() === req.user.id)) {
      return res.status(401).json({ message: 'Not authorized to access this conversation' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send message
// @route   POST /api/messaging/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some(p => p.toString() === req.user.id)) {
      return res.status(401).json({ message: 'Not authorized to send message to this conversation' });
    }

    // Create message
    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user.id,
      content: req.body.content,
      attachments: req.body.attachments || [],
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    // Populate sender
    await message.populate('sender', 'name profilePhoto');

    // Emit socket event for real-time messaging
    req.app.get('io').to(req.params.id).emit('newMessage', message);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark messages as read
// @route   POST /api/messaging/conversations/:id/read
// @access  Private
exports.markMessagesAsRead = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some(p => p.toString() === req.user.id)) {
      return res.status(401).json({ message: 'Not authorized to access this conversation' });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user.id },
        'readBy.user': { $ne: req.user.id },
      },
      {
        $push: {
          readBy: {
            user: req.user.id,
            readAt: Date.now(),
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete message
// @route   DELETE /api/messaging/conversations/:conversationId/messages/:messageId
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is message sender or admin
    if (message.sender.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this message' });
    }

    await message.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get unread count
// @route   GET /api/messaging/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    // Get all conversations the user is part of
    const conversations = await Conversation.find({
      participants: req.user.id,
    }).select('_id');

    const conversationIds = conversations.map(c => c._id);

    // Count unread messages
    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user.id },
      'readBy.user': { $ne: req.user.id },
    });

    res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (err) {
    next(err);
  }
};