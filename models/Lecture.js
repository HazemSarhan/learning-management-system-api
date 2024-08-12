const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Must provide valid lecture'],
  },
  content: {
    type: String,
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: [true, 'Must provide valid sectionId'],
  },
  type: {
    type: String,
    enum: ['video', 'image', 'text', 'quiz'],
    default: '',
  },
});
