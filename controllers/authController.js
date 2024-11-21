const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ConstructionCost = require('../models/ConstructionCost');
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ name, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: newUser._id, name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getUserProfile1 = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
          name: user.name,
          email: user.email,
          avatar: user.avatar, // Assuming there is an avatar field in the user schema
        });
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
};
exports.postUserProfile1 = async (req, res) => {
    const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the profile data
    user.name = name || user.name;
    user.email = email || user.email;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getCost = async (req, res) => {
    try {
      const costData = await ConstructionCost.findOne();
      console.log(costData);
  
      // If the costData exists and contains the updatedAt field, return it
      return res.status(200).json({
        foundation: costData.foundation,
        painting: costData.painting,
        lastUpdated: costData.updatedAt || "Not available",  // Use updatedAt here
      });
    } catch (err) {
      return res.status(500).json({ message: 'Error retrieving data', error: err.message });
    }
  };
  
  exports.updateCost = async (req, res) => {
    try {
      let costData = await ConstructionCost.findOne();
      console.log(costData);
  
      if (costData) {
        // Update existing data
        costData.foundation = req.body.foundation;
        costData.painting = req.body.painting;
        await costData.save();
        // Include updatedAt in the response
        res.json({
          message: 'Data updated successfully',
          data: costData,
          lastUpdated: costData.updatedAt || "Not available" // Include lastUpdated
        });
      } else {
        // Create new data
        costData = new ConstructionCost(req.body);
        await costData.save();
        // Include updatedAt in the response for the newly created document
        res.json({
          message: 'Data created successfully',
          data: costData,
          lastUpdated: costData.updatedAt || "Not available" // Include lastUpdated
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error saving data', error: err.message });
    }
  };
  