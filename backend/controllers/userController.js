const asyncHandler = require('express-async-handler');
const 
  User = require('../models/userModel'),
  generateToken = require('../utils/generateToken'),
  cookieOptions = require('../utils/cookieOptions')
;

// @desc    Auth user/set token
// @route   POST  /api/v1/users/auth
// @access  Public
exports.authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Check submitted data
  if(!email || !password) {
    res.status(401);
    throw new Error('Provide an email & password');
  }
  // Check if user exists
  const user = await User.findOne({ email });
  if(!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Confirm email & password match
  if(await user.confirmPassword(password)) {
    generateToken(res, user._id);
    req.user = user;
    res.status(200).json({ 
      id: user._id,
      name: user.name,
      email: user.email,
      message: `Welcome ${user.name} 😀` 
    });
    // next();
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// @desc    Register a new User
// @route   POST  /api/v1/users
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // check if data is provided
  if(!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all the details required to register');
    // return res.status(401).json({ message: 'Please provide all the details required to register' });
  }
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if(userExists) {
    res.status(400);
    throw new Error('User already exists')
    // return res.status(401).json({ message: 'A user already exists with that email'});
  }
  const user = await User.create({ name, email, password });

  if(user) {
    // generate & store token as cookie
    generateToken(res, user._id);

    res.status(201).json({ 
      _id: user._id,
      name: user.name,
      email: user.email,
      message: `😀 User: ${user.name} registered successfully` 
    });
  } else {
    res.status(400);
    throw new Error('User registration was unsuccessful')
  }
});

// @desc    Logout User
// @route   POST  /api/v1/users/logout
// @access  Public
exports.logoutUser = asyncHandler(async (req, res) => {
  // res.clearCookie('jwt');
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'User logged out 👋' });
});

// @desc    Get User profile
// @route   GET  /api/v1/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.user;
  const user = { id: _id, name, email };
  res.status(200).json(user);
});

// @desc    Update User profile
// @route   PUT  /api/v1/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if(user) {
    if(req.body.name) user.name = req.body.name;
    user.email = req.body.email || user.email;    // Another way of achieviing above
    // Updating password
    if(req.body.password && req.body.newPassword) {
      // user.password = req.body.password;
      // Verify old password
      if(!user.confirmPassword(req.body.password)) {
        res.status(400);
        throw new Error('password provided is wrong, please enter the correct password')
      }
      user.password = await require('bcryptjs').hash(req.body.newPassword, 10);  // improv since pre.save() middleware didnt work
    }
    const updatedUser = await user.save();
    const { _id, name, email } = updatedUser;
    res.status(200).json({ id: _id, name, email });

  } else {
    res.status(404);
    throw new Error('User not found');
  }
});