const ForumThread = require('../models/ForumThread');
const ForumComment = require('../models/ForumComment');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

// @desc    Get all threads
// @route   GET /api/forum/threads
// @access  Private
exports.getThreads = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single thread
// @route   GET /api/forum/threads/:id
// @access  Private
exports.getThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findById(req.params.id)
      .populate('author', 'name profilePhoto')
      .populate({
        path: 'likes',
        select: 'name profilePhoto',
      });

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Increment view count
    thread.views += 1;
    await thread.save();

    res.status(200).json({
      success: true,
      data: thread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create thread
// @route   POST /api/forum/threads
// @access  Private
exports.createThread = async (req, res, next) => {
  try {
    // Add author to req.body
    req.body.author = req.user.id;

    const thread = await ForumThread.create(req.body);

    res.status(201).json({
      success: true,
      data: thread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update thread
// @route   PUT /api/forum/threads/:id
// @access  Private
exports.updateThread = async (req, res, next) => {
  try {
    let thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Make sure user is thread author or admin
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this thread' });
    }

    thread = await ForumThread.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: thread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete thread
// @route   DELETE /api/forum/threads/:id
// @access  Private
exports.deleteThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Make sure user is thread author or admin
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this thread' });
    }

    // Delete all comments associated with the thread
    await ForumComment.deleteMany({ thread: req.params.id });

    await thread.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get comments for a thread
// @route   GET /api/forum/threads/:id/comments
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    const comments = await ForumComment.find({ thread: req.params.id })
      .populate('author', 'name profilePhoto')
      .populate({
        path: 'parentComment',
        populate: {
          path: 'author',
          select: 'name profilePhoto',
        },
      })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create comment
// @route   POST /api/forum/threads/:id/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    // Add thread and author to req.body
    req.body.thread = req.params.id;
    req.body.author = req.user.id;

    const comment = await ForumComment.create(req.body);

    // Populate thread and author
    await comment.populate('thread', 'title');
    await comment.populate('author', 'name profilePhoto');

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update comment
// @route   PUT /api/forum/threads/:threadId/comments/:commentId
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await ForumComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Make sure user is comment author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this comment' });
    }

    // Mark as edited
    req.body.isEdited = true;

    comment = await ForumComment.findByIdAndUpdate(req.params.commentId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/forum/threads/:threadId/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await ForumComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Make sure user is comment author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }

    // Delete all replies to this comment
    await ForumComment.deleteMany({ parentComment: req.params.commentId });

    await comment.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like thread
// @route   POST /api/forum/threads/:id/like
// @access  Private
exports.likeThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if user already liked the thread
    const alreadyLiked = thread.likes.some(
      like => like.user.toString() === req.user.id
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: 'You already liked this thread' });
    }

    // Add like
    thread.likes.push({ user: req.user.id });
    await thread.save();

    res.status(200).json({
      success: true,
      data: thread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike thread
// @route   POST /api/forum/threads/:id/unlike
// @access  Private
exports.unlikeThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if user liked the thread
    const likeIndex = thread.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex === -1) {
      return res.status(400).json({ message: 'You have not liked this thread' });
    }

    // Remove like
    thread.likes.splice(likeIndex, 1);
    await thread.save();

    res.status(200).json({
      success: true,
      data: thread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like comment
// @route   POST /api/forum/threads/:threadId/comments/:commentId/like
// @access  Private
exports.likeComment = async (req, res, next) => {
  try {
    const comment = await ForumComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user already liked the comment
    const alreadyLiked = comment.likes.some(
      like => like.user.toString() === req.user.id
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: 'You already liked this comment' });
    }

    // Add like
    comment.likes.push({ user: req.user.id });
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike comment
// @route   POST /api/forum/threads/:threadId/comments/:commentId/unlike
// @access  Private
exports.unlikeComment = async (req, res, next) => {
  try {
    const comment = await ForumComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user liked the comment
    const likeIndex = comment.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex === -1) {
      return res.status(400).json({ message: 'You have not liked this comment' });
    }

    // Remove like
    comment.likes.splice(likeIndex, 1);
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save thread
// @route   POST /api/forum/threads/:id/save
// @access  Private
exports.saveThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if user already saved the thread
    const alreadySaved = thread.savedBy.some(
      save => save.user.toString() === req.user.id
    );

    if (alreadySaved) {
      return res.status(400).json({ message: 'You already saved this thread' });
    }

    // Add to saved
    thread.savedBy.push({ user: req.user.id });
    await thread.save();

    res.status(200).json({
      success: true,
      data: thread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unsave thread
// @route   POST /api/forum/threads/:id/unsave
// @access  Private
exports.unsaveThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if user saved the thread
    const saveIndex = thread.savedBy.findIndex(
      save => save.user.toString() === req.user.id
    );

    if (saveIndex === -1) {
      return res.status(400).json({ message: 'You have not saved this thread' });
    }

    // Remove from saved
    thread.savedBy.splice(saveIndex, 1);
    await thread.save();

    res.status(200).json({
      success: true,
      data: thread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get saved threads
// @route   GET /api/forum/threads/saved
// @access  Private
exports.getSavedThreads = async (req, res, next) => {
  try {
    const threads = await ForumThread.find({
      'savedBy.user': req.user.id,
    })
      .populate('author', 'name profilePhoto')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: threads.length,
      data: threads,
    });
  } catch (err) {
    next(err);
  }
};