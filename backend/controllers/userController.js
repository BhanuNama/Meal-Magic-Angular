const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, mobileNumber, password, userRole } = req.body;

    // Validate required fields
    if (!username || !email || !mobileNumber || !password || !userRole) {
      return res.status(400).json({ 
        error: true, 
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: true, 
        message: 'Email already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      email,
      mobileNumber,
      password: hashedPassword,
      userRole
    });

    await newUser.save();

    res.status(201).json({ 
      error: false, 
      message: 'User Registration Successful', 
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userRole: newUser.userRole
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: true, 
      message: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: true, 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: true, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: true, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userRole: user.userRole 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      error: false, 
      message: 'Login Successfully', 
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          userRole: user.userRole
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: true, 
      message: error.message 
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: true, 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        error: true, 
        message: 'User not found' 
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      error: false, 
      message: 'Password has been updated successfully', 
      data: null 
    });
  } catch (error) {
    res.status(500).json({ 
      error: true, 
      message: error.message 
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    
    res.status(200).json({ 
      error: false, 
      message: 'All Users found successfully', 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ 
      error: true, 
      message: error.message 
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id, { password: 0 }); // Exclude password field
    
    if (!user) {
      return res.status(404).json({ 
        error: true, 
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ 
      error: false, 
      message: 'User found successfully', 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      error: true, 
      message: error.message 
    });
  }
};

