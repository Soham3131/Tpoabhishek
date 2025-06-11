const Internship = require("../models/Internship");

// @desc    Create a new internship
// @route   POST /api/internships/create
// @access  Private (Recruiter, Admin)
exports.createInternship = async (req, res) => {
  try {
    const newInternshipData = {
      ...req.body,
      user: req.user.id, // Link the internship to the user who created it
    };
    const internship = await Internship.create(newInternshipData);
    res.status(201).json(internship);
  } catch (err) {
    console.error("Error creating internship:", err);
    res.status(500).json({ msg: "Error creating internship", error: err.message });
  }
};

// @desc    Get all internships with search and filter (active only)
// @route   GET /api/internships
// @access  Public
exports.getAllInternships = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active', // Only fetch active internships
      deadline: { $gte: new Date() } // Only fetch internships with future or current deadlines
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { company: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const data = await Internship.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching internships:", err);
    res.status(500).json({ msg: "Error fetching internships", error: err.message });
  }
};

// @desc    Get a single internship by ID
// @route   GET /api/internships/:id
// @access  Public
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      // This is the message you are seeing, meaning findById returned null
      return res.status(404).json({ msg: "Internship not found" });
    }
    res.status(200).json(internship);
  } catch (err) {
    console.error("Error fetching internship by ID:", err);
    // If there's a Mongoose casting error for the ID, it might hit here
    res.status(500).json({ msg: "Error fetching internship", error: err.message });
  }
};

// @desc    Delete an internship by ID
// @route   DELETE /api/internships/:id
// @access  Private (Admin or Creator)
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && internship.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this internship. Only an admin or the creator can delete." });
    }

    await internship.deleteOne();
    res.status(200).json({ msg: "Internship deleted successfully" });
  } catch (err) {
    console.error("Error deleting internship:", err);
    res.status(500).json({ msg: "Error deleting internship", error: err.message });
  }
};
