const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Must provide valid lecture'],
    },
    content: [
      {
        type: String, // if (cloudinary) ? URL : mongoDB
        default: '/uploads/course-content.mp4',
        required: true,
      },
    ],
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Must provide valid sectionId'],
    },
    type: {
      type: String,
      enum: ['video', 'image', 'text', 'quiz', 'pdf'],
      default: 'text',
    },
    duration: {
      type: String,
    },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lecture', LectureSchema);
