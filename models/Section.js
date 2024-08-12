const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Must provide a valid section title'],
    },
    description: { type: String, maxlength: 500 },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Please provide valid courseId!'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Section', SectionSchema);
