const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const register = async (req, res) => {
  const { name, email, password, bio } = req.body;
  if (!name || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all required fields');
  }

  // Check if the email already registered
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    throw new CustomError.BadRequestError('Email is already exist!');
  }

  // Set the first registered user as an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'student';

  // Uploading image to cloud
  let profilePicture = '/uploads/default.jpeg'; // default value
  if (req.files && req.files.profilePicture) {
    const result = await cloudinary.uploader.upload(
      req.files.profilePicture.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      }
    );
    fs.unlinkSync(req.files.profilePicture.tempFilePath);
    profilePicture = result.secure_url;
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    role,
    bio,
    profilePicture,
  });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      'Please provide a valid email and password'
    );
  }

  // Check if the email is available
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  // Comparing hash password with plain text
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: `User has been logged out successfully!` });
};

module.exports = {
  register,
  login,
  logout,
};
