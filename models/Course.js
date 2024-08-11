const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: [true, 'Please provide a valid course title'],
    },
    description: {
      type: String,
      maxlength: 100,
      required: [true, 'Please provide a valid course description'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    requirements: {
      type: [String],
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: '/uploads/default_course_image.jpeg',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  { timestamps: true }
);

CourseSchema.pre('save', function (next) {
  if (this.price === 0) {
    this.isPaid = false;
  } else {
    this.isPaid = true;
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);