const Job = require('../models/Job');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name profilePhoto');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res, next) => {
  try {
    // Add postedBy to req.body
    req.body.postedBy = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Make sure user is job poster or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Make sure user is job poster or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Apply to job
// @route   POST /api/jobs/:id/apply
// @access  Private
exports.applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // In a real app, you would create a job application model
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save job
// @route   POST /api/jobs/:id/save
// @access  Private
exports.saveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // In a real app, you would add the job to the user's saved jobs
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Job saved successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unsave job
// @route   POST /api/jobs/:id/unsave
// @access  Private
exports.unsaveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // In a real app, you would remove the job from the user's saved jobs
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Job unsaved successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get saved jobs
// @route   GET /api/jobs/saved
// @access  Private
exports.getSavedJobs = async (req, res, next) => {
  try {
    // In a real app, you would fetch the user's saved jobs
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

// @desc    Get job applications
// @route   GET /api/jobs/applications
// @access  Private
exports.getJobApplications = async (req, res, next) => {
  try {
    // In a real app, you would fetch the user's job applications
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

// @desc    Approve job
// @route   PUT /api/jobs/:id/approve
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
// @route   PUT /api/jobs/:id/reject
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