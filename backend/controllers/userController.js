const User = require('../models/User');
const Alumni = require('../models/Alumni');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
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

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove associated alumni profile if exists
    await Alumni.findOneAndDelete({ user: req.params.id });

    await user.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile photo
// @route   PUT /api/users/profile/photo
// @access  Private
exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete previous photo if exists
    if (user.profilePhoto) {
      const publicId = user.profilePhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Upload new photo
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'setuconnect/profiles',
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });

    // Update user profile
    user.profilePhoto = result.secure_url;
    await user.save();

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: user.profilePhoto,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update privacy settings
// @route   PUT /api/users/privacy
// @access  Private
exports.updatePrivacySettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.privacy = {
      ...user.privacy,
      ...req.body,
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: user.privacy,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get notification preferences
// @route   GET /api/users/notifications/preferences
// @access  Private
exports.getNotificationPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('notificationPreferences');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.notificationPreferences,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update notification preferences
// @route   PUT /api/users/notifications/preferences
// @access  Private
exports.updateNotificationPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...req.body,
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: user.notificationPreferences,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export user data
// @route   GET /api/users/export
// @access  Private
exports.exportUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const alumni = await Alumni.findOne({ user: req.user.id });

    const userData = {
      profile: user,
      alumni: alumni || null,
    };

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove associated alumni profile if exists
    await Alumni.findOneAndDelete({ user: req.user.id });

    // Delete profile photo if exists
    if (user.profilePhoto) {
      const publicId = user.profilePhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};