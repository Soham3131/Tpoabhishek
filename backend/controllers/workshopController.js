const Workshop = require("../models/Workshop");

// @desc    Create a new workshop
// @route   POST /api/workshops/create
// @access  Private (Recruiter, Admin)
exports.createWorkshop = async (req, res) => {
  try {
    const newWorkshopData = {
      ...req.body,
      user: req.user.id, // Link the workshop to the user who created it
    };
    const workshop = await Workshop.create(newWorkshopData);
    res.status(201).json(workshop);
  } catch (err) {
    console.error("Error creating workshop:", err);
    res.status(500).json({ msg: "Error creating workshop", error: err.message });
  }
};

// @desc    Get all workshops with search and filter (active only)
// @route   GET /api/workshops
// @access  Public
exports.getAllWorkshops = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active', // Only fetch active workshops
      date: { $gte: new Date() } // Only fetch workshops with future or current dates
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

    const data = await Workshop.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching workshops:", err);
    res.status(500).json({ msg: "Error fetching workshops", error: err.message });
  }
};

// @desc    Get a single workshop by ID
// @route   GET /api/workshops/:id
// @access  Public
exports.getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ msg: "Workshop not found" });
    }
    res.status(200).json(workshop);
  } catch (err) {
    console.error("Error fetching workshop by ID:", err);
    res.status(500).json({ msg: "Error fetching workshop", error: err.message });
  }
};

// @desc    Delete a workshop by ID
// @route   DELETE /api/workshops/:id
// @access  Private (Admin or Creator)
exports.deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return res.status(404).json({ msg: "Workshop not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && workshop.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this workshop. Only an admin or the creator can delete." });
    }

    await workshop.deleteOne();
    res.status(200).json({ msg: "Workshop deleted successfully" });
  } catch (err) {
    console.error("Error deleting workshop:", err);
    res.status(500).json({ msg: "Error deleting workshop", error: err.message });
  }
};
