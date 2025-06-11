const JobFair = require("../models/JobFair");

// @desc    Create a new job fair
// @route   POST /api/jobfairs/create
// @access  Private (Recruiter, Admin)
exports.createJobFair = async (req, res) => {
  try {
    const newJobFairData = {
      ...req.body,
      user: req.user.id, // Link the job fair to the user who created it
    };
    const jobFair = await JobFair.create(newJobFairData);
    res.status(201).json(jobFair);
  } catch (err) {
    console.error("Error creating job fair:", err);
    res.status(500).json({ msg: "Error creating job fair", error: err.message });
  }
};

// @desc    Get all job fairs with search and filter (active only)
// @route   GET /api/jobfairs
// @access  Public
exports.getAllJobFairs = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active', // Only fetch active job fairs
      date: { $gte: new Date() } // Only fetch job fairs with future or current dates
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { organizer: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { participatingCompanies: { $regex: searchRegex } }, // Search within array
      ];
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const data = await JobFair.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching job fairs:", err);
    res.status(500).json({ msg: "Error fetching job fairs", error: err.message });
  }
};

// @desc    Get a single job fair by ID
// @route   GET /api/jobfairs/:id
// @access  Public
exports.getJobFairById = async (req, res) => {
  try {
    const jobFair = await JobFair.findById(req.params.id);
    if (!jobFair) {
      return res.status(404).json({ msg: "Job fair not found" });
    }
    res.status(200).json(jobFair);
  } catch (err) {
    console.error("Error fetching job fair by ID:", err);
    res.status(500).json({ msg: "Error fetching job fair", error: err.message });
  }
};

// @desc    Delete a job fair by ID
// @route   DELETE /api/jobfairs/:id
// @access  Private (Admin or Creator)
exports.deleteJobFair = async (req, res) => {
  try {
    const { id } = req.params;
    const jobFair = await JobFair.findById(id);

    if (!jobFair) {
      return res.status(404).json({ msg: "Job fair not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && jobFair.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this job fair. Only an admin or the creator can delete." });
    }

    await jobFair.deleteOne();
    res.status(200).json({ msg: "Job fair deleted successfully" });
  } catch (err) {
    console.error("Error deleting job fair:", err);
    res.status(500).json({ msg: "Error deleting job fair", error: err.message });
  }
};
