const User = require('../models/User');
const { StatusCodes, OK } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  checkPermission,
  attachCookiesToResponse,
  paginate,
} = require('../utils');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const getAllUsers = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort,
    fields,
    numericFilters,
    name,
    email,
    role,
    bio,
  } = req.query;

  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (email) {
    queryObject.email = { $regex: email, $options: 'i' };
  }
  if (role) {
    queryObject.role = { $regex: role, $options: 'i' };
  }
  if (bio) {
    queryObject.bio = { $regex: bio, $options: 'i' };
  }

  const options = { page, limit, sort, fields, numericFilters };
  const { results: users, pagination } = await paginate(
    User,
    queryObject,
    options,
    '-password'
  );
  res.status(StatusCodes.OK).json({ users, meta: { pagination } });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(
      `No users found with this id: ${userId}`
    );
  }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { name, email, bio } = req.body;

  // Update and upload image to cloud
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

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { email, name, bio, profilePicture },
    { new: true, runValidators: true }
  ).select('-password');

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please provide both (old and new passwords)'
    );
  }

  const user = await User.findById(req.user.userId);
  const isPasswordCorrect = user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Old password is not correct!');
  }
  user.password = newPassword;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: `Password has been changed successfully!` });
};

const changeUserRole = async (req, res) => {
  const { id: userId } = req.params;
  const { role } = req.body;

  // Only admins allowed to change user roles!
  if (req.user.role !== 'admin') {
    throw new CustomError.UnauthorizedError(
      'Not authorized to change user roles'
    );
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(
      `No users found with this id: ${userId}`
    );
  }

  user.role = role;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ userRole: user.role, msg: `User role updated successfully.` });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  changeUserRole,
};
