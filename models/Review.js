const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Must provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Must provide review comment'],
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Must provide review rating'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Must provide courseId'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Must provide studentId'],
    },
  },
  { timestamps: true }
);

// Make sure that the student can make only one review per course!
ReviewSchema.index({ course: 1, student: 1 }, { unique: true });

// Calculate the average rating && number of reviews
ReviewSchema.statics.calculateAverage = async function (courseId) {
  const result = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Course').findByIdAndUpdate(courseId, {
      averageRating: Math.ceil(result[0]?.averageRating || 0),
      numOfReviews: result[0]?.numOfReviews || 0,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update review counts and average rating
ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverage(this.course);
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverage(doc.course);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
