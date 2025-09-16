const FundraisingCampaign = require('../models/FundraisingCampaign');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

// @desc    Get all campaigns
// @route   GET /api/fundraising/campaigns
// @access  Private
exports.getCampaigns = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single campaign
// @route   GET /api/fundraising/campaigns/:id
// @access  Private
exports.getCampaign = async (req, res, next) => {
  try {
    const campaign = await FundraisingCampaign.findById(req.params.id)
      .populate('organizer', 'name profilePhoto')
      .populate('donations.donor', 'name profilePhoto');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create campaign
// @route   POST /api/fundraising/campaigns
// @access  Private
exports.createCampaign = async (req, res, next) => {
  try {
    // Add organizer to req.body
    req.body.organizer = req.user.id;

    const campaign = await FundraisingCampaign.create(req.body);

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update campaign
// @route   PUT /api/fundraising/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res, next) => {
  try {
    let campaign = await FundraisingCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Make sure user is campaign organizer or admin
    if (campaign.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this campaign' });
    }

    campaign = await FundraisingCampaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete campaign
// @route   DELETE /api/fundraising/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await FundraisingCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Make sure user is campaign organizer or admin
    if (campaign.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this campaign' });
    }

    await campaign.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Donate to campaign
// @route   POST /api/fundraising/campaigns/:id/donate
// @access  Private
exports.donateToCampaign = async (req, res, next) => {
  try {
    const campaign = await FundraisingCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Add donation
    campaign.donations.push({
      donor: req.user.id,
      amount: req.body.amount,
      anonymous: req.body.anonymous || false,
      message: req.body.message || '',
    });

    // Update raised amount
    campaign.raised += req.body.amount;

    await campaign.save();

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get donation history
// @route   GET /api/fundraising/donations
// @access  Private
exports.getDonationHistory = async (req, res, next) => {
  try {
    // Find all donations by the user
    const campaigns = await FundraisingCampaign.find({
      'donations.donor': req.user.id,
    })
      .populate('organizer', 'name profilePhoto')
      .select('title description donations');

    // Extract donations from campaigns
    const donations = [];
    campaigns.forEach(campaign => {
      campaign.donations.forEach(donation => {
        if (donation.donor._id.toString() === req.user.id) {
          donations.push({
            ...donation.toObject(),
            campaign: {
              _id: campaign._id,
              title: campaign.title,
              description: campaign.description,
            },
          });
        }
      });
    });

    // Sort by date (newest first)
    donations.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured campaigns
// @route   GET /api/fundraising/campaigns/featured
// @access  Public
exports.getFeaturedCampaigns = async (req, res, next) => {
  try {
    const campaigns = await FundraisingCampaign.find({ featured: true })
      .populate('organizer', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve campaign
// @route   PUT /api/fundraising/campaigns/:id/approve
// @access  Private/Admin
exports.approveCampaign = async (req, res, next) => {
  try {
    let campaign = await FundraisingCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.isApproved = true;
    await campaign.save();

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject campaign
// @route   PUT /api/fundraising/campaigns/:id/reject
// @access  Private/Admin
exports.rejectCampaign = async (req, res, next) => {
  try {
    let campaign = await FundraisingCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.isApproved = false;
    await campaign.save();

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};