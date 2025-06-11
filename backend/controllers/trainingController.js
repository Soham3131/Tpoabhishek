const Training = require("../models/Training");

// @desc    Create a new training
// @route   POST /api/trainings/create
// @access  Private (Recruiter, Admin)
exports.createTraining = async (req, res) => {
  try {
    const newTrainingData = {
      ...req.body,
      user: req.user.id, // Link the training to the user who created it
    };
    const training = await Training.create(newTrainingData);
    res.status(201).json(training);
  } catch (err) {
    console.error("Error creating training:", err);
    res.status(500).json({ msg: "Error creating training", error: err.message });
  }
};

// @desc    Get all trainings with search and filter (active only)
// @route   GET /api/trainings
// @access  Public
exports.getAllTrainings = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {
      status: 'active', // Only fetch active trainings
      startDate: { $gte: new Date() } // Only fetch trainings with future or current start dates
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { provider: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const data = await Training.find(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching trainings:", err);
    res.status(500).json({ msg: "Error fetching trainings", error: err.message });
  }
};

// @desc    Get a single training by ID
// @route   GET /api/trainings/:id
// @access  Public
exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ msg: "Training not found" });
    }
    res.status(200).json(training);
  } catch (err) {
    console.error("Error fetching training by ID:", err);
    res.status(500).json({ msg: "Error fetching training", error: err.message });
  }
};

// @desc    Delete a training by ID
// @route   DELETE /api/trainings/:id
// @access  Private (Admin or Creator)
exports.deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findById(id);

    if (!training) {
      return res.status(404).json({ msg: "Training not found" });
    }

    // Authorization check: Only admin OR the creator can delete
    if (req.user.role !== 'admin' && training.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this training. Only an admin or the creator can delete." });
    }

    await training.deleteOne();
    res.status(200).json({ msg: "Training deleted successfully" });
  } catch (err) {
    console.error("Error deleting training:", err);
    res.status(500).json({ msg: "Error deleting training", error: err.message });
  }
};
