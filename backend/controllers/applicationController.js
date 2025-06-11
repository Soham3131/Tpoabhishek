const Application = require('../models/Application');
const User = require('../models/User'); // Required for populating user details
const mongoose = require('mongoose'); // ADDED: Import mongoose here

// Import all content models to fetch details (needed for aggregation lookups)
const Placement = require('../models/Placement');
const Internship = require('../models/Internship');
const Seminar = require('../models/Seminar');
const Training = require('../models/Training');
const Visit = require('../models/Visit');
const JobFair = require('../models/JobFair');
const Workshop = require('../models/Workshop');


// @desc    Track an application click
// @route   POST /api/applications/track
// @access  Private (Authenticated User)
exports.trackApplication = async (req, res) => {
  const { contentId, contentType, appliedLink } = req.body;

  if (!contentId || !contentType || !appliedLink) {
    return res.status(400).json({ msg: 'Missing required application tracking fields.' });
  }

  const validContentTypes = ['job', 'internship', 'seminar', 'workshop', 'visit', 'jobfair', 'training'];
  if (!validContentTypes.includes(contentType)) {
      return res.status(400).json({ msg: 'Invalid content type provided for tracking.' });
  }

  try {
    const existingApplication = await Application.findOne({
      userId: req.user.id,
      contentId,
      contentType,
    });

    if (existingApplication) {
      return res.status(200).json({ msg: 'Application already tracked for this item.' });
    }

    const application = new Application({
      userId: req.user.id,
      contentId,
      contentType,
      appliedLink,
    });

    await application.save();
    res.status(201).json({ msg: 'Application tracked successfully!', application });
  } catch (err) {
    console.error('Error tracking application:', err);
    res.status(500).json({ msg: 'Server error tracking application.', error: err.message });
  }
};

// @desc    Get applications for the logged-in user with content details
// @route   GET /api/applications/my
// @access  Private (Authenticated User)
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ensure userId is a valid ObjectId for matching in aggregation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID format.' });
    }

    const applications = await Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Corrected usage of ObjectId
      { $sort: { appliedAt: -1 } }, // Sort by most recent

      // Conditional $lookup based on contentType to fetch specific content details
      // Use $facet to run multiple lookup pipelines in parallel for different content types
      {
        $facet: {
          jobs: [
            { $match: { contentType: 'job' } },
            { $lookup: { from: 'placements', localField: 'contentId', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: { path: '$contentDetails', preserveNullAndEmptyArrays: true } },
          ],
          internships: [
            { $match: { contentType: 'internship' } },
            { $lookup: { from: 'internships', localField: 'contentId', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: { path: '$contentDetails', preserveNullAndEmptyArrays: true } },
          ],
          seminars: [
            { $match: { contentType: 'seminar' } },
            { $lookup: { from: 'seminars', localField: 'contentId', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: { path: '$contentDetails', preserveNullAndEmptyArrays: true } },
          ],
          trainings: [
            { $match: { contentType: 'training' } },
            { $lookup: { from: 'trainings', localField: 'contentId', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: { path: '$contentDetails', preserveNullAndEmptyArrays: true } },
          ],
          visits: [
            { $match: { contentType: 'visit' } },
            { $lookup: { from: 'visits', localField: 'contentId', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: { path: '$contentDetails', preserveNullAndEmptyArrays: true } },
          ],
          jobfairs: [
            { $match: { contentType: 'jobfair' } },
            { $lookup: { from: 'jobfairs', localField: 'contentId', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: { path: '$contentDetails', preserveNullAndEmptyArrays: true } },
          ],
          workshops: [
            { $match: { contentType: 'workshop' } },
            { $lookup: { from: 'workshops', localField: 'contentId', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: { path: '$contentDetails', preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      // Combine all arrays into a single array
      {
        $project: {
          allApplications: {
            $concatArrays: [
              '$jobs',
              '$internships',
              '$seminars',
              '$trainings',
              '$visits',
              '$jobfairs',
              '$workshops',
            ],
          },
        },
      },
      { $unwind: '$allApplications' }, // Deconstruct the combined array
      { $replaceRoot: { newRoot: '$allApplications' } }, // Promote the application document to the root
      { $sort: { appliedAt: -1 } }, // Re-sort the combined applications
    ]);

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching user applications:', err);
    res.status(500).json({ msg: 'Server error fetching applications.', error: err.message });
  }
};


// @desc    Get all applications (for Admin)
// @route   GET /api/applications/all
// @access  Private (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email studentId') // Populate user details
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching all applications:', err);
    res.status(500).json({ msg: 'Server error fetching all applications.', error: err.message });
  }
};


// @desc    Get aggregated application report for Admin
// @route   GET /api/applications/report
// @access  Private (Admin)
exports.getApplicationReport = async (req, res) => {
  try {
    const allApplications = await Application.find().populate('userId', 'name email studentId');

    // Helper to get content details from respective model
    const getContentDetails = async (contentId, contentType) => {
      let model;
      switch (contentType) {
        case 'job': model = Placement; break;
        case 'internship': model = Internship; break;
        case 'seminar': model = Seminar; break;
        case 'training': model = Training; break;
        case 'visit': model = Visit; break;
        case 'jobfair': model = JobFair; break;
        case 'workshop': model = Workshop; break;
        default: return null;
      }
      // Select fields commonly used for titles/names and identifying info
      const content = await model.findById(contentId).select('title companyName organization company organizer provider location');
      return content ? content.toObject() : null;
    };

    const report = {};

    for (const app of allApplications) {
      const { contentType, contentId, userId } = app;

      if (!report[contentType]) {
        report[contentType] = {
          contentType,
          totalCount: 0,
          items: {}, // Stores items by contentId
        };
      }
      report[contentType].totalCount++;

      if (!report[contentType].items[contentId]) {
        // Fetch content details only once per unique contentId
        const details = await getContentDetails(contentId, contentType);
        report[contentType].items[contentId] = {
          contentId,
          title: details?.title || details?.companyName || details?.organization || 'N/A', // Prioritize specific titles
          company: details?.company || details?.organization || details?.provider || 'N/A',
          location: details?.location || 'N/A',
          organizer: details?.organizer || 'N/A',
          provider: details?.provider || 'N/A',
          applicationCount: 0,
          applicants: [],
        };
      }

      report[contentType].items[contentId].applicationCount++;
      // Add applicant details to the item
      if (userId) { // Ensure userId is populated
        report[contentType].items[contentId].applicants.push({
          _id: userId._id,
          name: userId.name,
          email: userId.email,
          studentId: userId.studentId,
        });
      }
    }

    // Convert the nested object structure to an an array format for frontend
    const formattedReport = Object.values(report).map(contentTypeGroup => {
      contentTypeGroup.items = Object.values(contentTypeGroup.items);
      return contentTypeGroup;
    });

    res.status(200).json(formattedReport);
  } catch (err) {
    console.error('Error generating application report:', err);
    res.status(500).json({ msg: 'Server error generating application report.', error: err.message });
  }
};