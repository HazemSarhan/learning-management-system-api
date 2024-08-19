const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a valid category name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
