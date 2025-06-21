
const Placement = require("../models/Placement"); // Assuming this model exists

// @desc    Create a new placement (Job)
// @route   POST /api/placements
// @access  Private (Recruiter, Admin)
exports.createPlacement = async (req, res) => {
  try {
    const newPlacementData = {
      ...req.body,
      user: req.user.id, // Link the placement to the user who created it
    };
    const placement = await Placement.create(newPlacementData);
    res.status(201).json(placement);
  } catch (err) {
    console.error("Error creating placement:", err);
    res.status(500).json({ msg: "Error creating placement", error: err.message });
  }
};

// @desc    Get all placements (Jobs) with search and filter (active only)
// @route   GET /api/placements
// @access  Public
exports.getAllPlacements = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active', // Only fetch active placements
      deadline: { $gte: new Date() } // Only fetch placements with future or current deadlines
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { company: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { requirements: { $regex: searchRegex } }, // Search within array
      ];
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const data = await Placement.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching placements:", err);
    res.status(500).json({ msg: "Error fetching placements", error: err.message });
  }
};

// @desc    Get a single placement (Job) by ID
// @route   GET /api/placements/:id
// @access  Public
exports.getPlacementById = async (req, res) => {
  try {
    // IMPORTANT: Make sure no .select() is used to exclude fields unless necessary.
    // By default, findById returns all fields defined in the schema.
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ msg: "Placement not found" });
    }
    res.status(200).json(placement);
  } catch (err) {
    console.error("Error fetching placement by ID:", err);
    res.status(500).json({ msg: "Error fetching placement", error: err.message });
  }
};

// @desc    Delete a placement (Job) by ID
// @route   DELETE /api/placements/:id
// @access  Private (Admin or Creator)
exports.deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const placement = await Placement.findById(id);

    if (!placement) {
      return res.status(404).json({ msg: "Placement not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && placement.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this placement. Only an admin or the creator can delete." });
    }

    await placement.deleteOne();
    res.status(200).json({ msg: "Placement deleted successfully" });
  } catch (err) {
    console.error("Error deleting placement:", err);
    res.status(500).json({ msg: "Error deleting placement", error: err.message });
  }
};
