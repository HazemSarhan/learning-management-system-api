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
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
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
      type: [String], // Multiple requirements
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
    numOfReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
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
