const Seminar = require("../models/Seminar");

// @desc    Create a new seminar
// @route   POST /api/seminars/create
// @access  Private (Recruiter, Admin)
exports.createSeminar = async (req, res) => {
  try {
    const newSeminarData = {
      ...req.body,
      user: req.user.id, // Link the seminar to the user who created it
    };
    const seminar = await Seminar.create(newSeminarData);
    res.status(201).json(seminar);
  } catch (err) {
    console.error("Error creating seminar:", err);
    res.status(500).json({ msg: "Error creating seminar", error: err.message });
  }
};

// @desc    Get all seminars with search and filter (active only)
// @route   GET /api/seminars
// @access  Public
exports.getAllSeminars = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active', // Only fetch active seminars
      date: { $gte: new Date() } // Only fetch seminars with future or current dates
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { organizer: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const data = await Seminar.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching seminars:", err);
    res.status(500).json({ msg: "Error fetching seminars", error: err.message });
  }
};

// @desc    Get a single seminar by ID
// @route   GET /api/seminars/:id
// @access  Public
exports.getSeminarById = async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar) {
      return res.status(404).json({ msg: "Seminar not found" });
    }
    res.status(200).json(seminar);
  } catch (err) {
    console.error("Error fetching seminar by ID:", err);
    res.status(500).json({ msg: "Error fetching seminar", error: err.message });
  }
};

// @desc    Delete a seminar by ID
// @route   DELETE /api/seminars/:id
// @access  Private (Admin or Creator)
exports.deleteSeminar = async (req, res) => {
  try {
    const { id } = req.params;
    const seminar = await Seminar.findById(id);

    if (!seminar) {
      return res.status(404).json({ msg: "Seminar not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && seminar.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this seminar. Only an admin or the creator can delete." });
    }

    await seminar.deleteOne();
    res.status(200).json({ msg: "Seminar deleted successfully" });
  } catch (err) {
    console.error("Error deleting seminar:", err);
    res.status(500).json({ msg: "Error deleting seminar", error: err.message });
  }
};
