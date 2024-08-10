const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 50,
      required: [true, 'Please provide a valid name'],
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'please provide a valid email',
      },
      required: [true, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Please provide a valid password'],
    },
    role: {
      type: String,
      enum: ['admin', 'instructor', 'student'],
      default: 'student',
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    profilePicture: {
      type: String,
      default: '/uploads/default.jpeg',
    },
  },
  { timestamps: true }
);

// Hashing password
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // no hashing password if no changes
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
