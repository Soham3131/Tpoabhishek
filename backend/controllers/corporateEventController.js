const CorporateEvent = require("../models/CorporateEvent");

// @desc    Create a new corporate event
// @route   POST /api/corporate-events
// @access  Private (Recruiter, Admin)
exports.createCorporateEvent = async (req, res) => {
  try {
    const newCorporateEventData = {
      ...req.body,
      user: req.user.id,
    };
    const corporateEvent = await CorporateEvent.create(newCorporateEventData);
    res.status(201).json(corporateEvent);
  } catch (err) {
    console.error("Error creating corporate event:", err);
    res.status(500).json({ msg: "Error creating corporate event", error: err.message });
  }
};

// @desc    Get all corporate events with search and filter
// @route   GET /api/corporate-events
// @access  Public
exports.getAllCorporateEvents = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active',
      date: { $gte: new Date() }
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { hostCompany: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { speakers: { $regex: searchRegex } },
      ];
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const data = await CorporateEvent.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching corporate events:", err);
    res.status(500).json({ msg: "Error fetching corporate events", error: err.message });
  }
};

// @desc    Get a single corporate event by ID
// @route   GET /api/corporate-events/:id
// @access  Public
exports.getCorporateEventById = async (req, res) => {
  try {
    const corporateEvent = await CorporateEvent.findById(req.params.id);
    if (!corporateEvent) {
      return res.status(404).json({ msg: "Corporate event not found" });
    }
    res.status(200).json(corporateEvent);
  } catch (err) {
    console.error("Error fetching corporate event by ID:", err);
    res.status(500).json({ msg: "Error fetching corporate event", error: err.message });
  }
};

// @desc    Delete a corporate event by ID
// @route   DELETE /api/corporate-events/:id
// @access  Private (Admin or Creator)
exports.deleteCorporateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const corporateEvent = await CorporateEvent.findById(id);

    if (!corporateEvent) {
      return res.status(404).json({ msg: "Corporate event not found" });
    }

    if (req.user.role !== 'admin' && corporateEvent.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this corporate event. Only an admin or the creator can delete." });
    }

    await corporateEvent.deleteOne();
    res.status(200).json({ msg: "Corporate event deleted successfully" });
  } catch (err) {
    console.error("Error deleting corporate event:", err);
    res.status(500).json({ msg: "Error deleting corporate event", error: err.message });
  }
};