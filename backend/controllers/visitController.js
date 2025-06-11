const Visit = require("../models/Visit");

// @desc    Create a new visit
// @route   POST /api/visits (now without /create)
// @access  Private (Recruiter, Admin)
exports.createVisit = async (req, res) => {
  try {
    const { companyName, ...restOfBody } = req.body; // Destructure companyName
    
    const newVisitData = {
      title: companyName, // Map companyName from frontend to title for the model
      organization: companyName, // Assuming organization is also the companyName
      ...restOfBody,
      user: req.user.id, // Link the visit to the user who created it
    };

    const visit = await Visit.create(newVisitData);
    res.status(201).json(visit);
  } catch (err) {
    console.error("Error creating visit:", err);
    // Mongoose validation errors often have 'name: "ValidationError"'
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({ msg: `Validation Error: ${errors.join('. ')}`, detailedError: err.message });
    }
    res.status(500).json({ msg: "Error creating visit", error: err.message });
  }
};

// @desc    Get all visits with search and filter (active only)
// @route   GET /api/visits
// @access  Public
exports.getAllVisits = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active', // Only fetch active visits
      date: { $gte: new Date() } // Only fetch visits with future or current dates
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } }, // Search by title (now populated by companyName)
        { organization: { $regex: searchRegex } },
        { purpose: { $regex: searchRegex } },
        { contactPerson: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
      ];
    }

    if (location) { // Apply location filter directly to the 'location' field
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const data = await Visit.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ msg: "Error fetching visits", error: err.message });
  }
};

// @desc    Get a single visit by ID
// @route   GET /api/visits/:id
// @access  Public
exports.getVisitById = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ msg: "Visit not found" });
    }
    res.status(200).json(visit);
  } catch (err) {
    console.error("Error fetching visit by ID:", err);
    res.status(500).json({ msg: "Error fetching visit", error: err.message });
  }
};

// @desc    Delete a visit by ID
// @route   DELETE /api/visits/:id
// @access  Private (Admin or Creator)
exports.deleteVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);

    if (!visit) {
      return res.status(404).json({ msg: "Visit not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && visit.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this visit. Only an admin or the creator can delete." });
    }

    await visit.deleteOne();
    res.status(200).json({ msg: "Visit deleted successfully" });
  } catch (err) {
    console.error("Error deleting visit:", err);
    res.status(500).json({ msg: "Error deleting visit", error: err.message });
  }
};
