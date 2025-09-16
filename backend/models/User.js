const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ✅ Added for JWT signing

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  graduationYear: {
    type: Number,
  },
  degree: {
    type: String,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  jobTitle: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  skills: [String],
  interests: [String],
  linkedinUrl: {
    type: String,
    default: '',
  },
  twitterUrl: {
    type: String,
    default: '',
  },
  websiteUrl: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpire: {
    type: Date,
  },
  privacy: {
    showEmail: {
      type: Boolean,
      default: true,
    },
    showPhone: {
      type: Boolean,
      default: false,
    },
    showBio: {
      type: Boolean,
      default: true,
    },
  },
  notificationPreferences: {
    events: {
      type: Boolean,
      default: true,
    },
    jobs: {
      type: Boolean,
      default: true,
    },
    mentorship: {
      type: Boolean,
      default: false,
    },
    fundraising: {
      type: Boolean,
      default: true,
    },
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
