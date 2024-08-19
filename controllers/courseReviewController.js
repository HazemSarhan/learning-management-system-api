const User = require('../models/User');
const Course = require('../models/Course');
const Review = require('../models/Review');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { checkPermission } = require('../utils');

const createReview = async (req, res) => {
  const { course: courseId } = req.body;

  // Check for course availablity
  const isValidCourse = await Course.findById(courseId);
  if (!isValidCourse) {
    throw new CustomError.NotFoundError(
      `No courses found with thid id: ${courseId}`
    );
  }

  // Check if the user already purchased the course or no
  if (!isValidCourse.students.includes(req.user.userId)) {
    throw new CustomError.BadRequestError(
      `You must buy the course to write a review!`
    );
  }

  // Check if the user already submited a review or no
  const isAlreadySubmit = await Review.findOne({
    course: courseId,
    student: req.user.userId,
  });
  if (isAlreadySubmit) {
    throw new CustomError.BadRequestError(
      `You can review the course only 1 time!`
    );
  }

  req.body.student = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const review = await Review.find({});
  res.status(StatusCodes.OK).json({ review });
};

const getReviewById = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(
      `No reviews found with id: ${reviewId}`
    );
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, rating, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No reviews found with id: ${reviewId}`
    );
  }

  // Check if the student is the owner of the review
  checkPermission(req.user, review.student);

  review.title = title;
  review.rating = rating;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOneAndDelete({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No reviews found with id: ${reviewId}`
    );
  }
  // Check if the student is the owner of the review
  checkPermission(req.user, review.student);
  res.status(StatusCodes.OK).json({ msg: `Review has been deleted!` });
};

const getCourseReviews = async (req, res) => {
  const { id: courseId } = req.params;
  const reviews = await Review.find({ course: courseId });
  if (!reviews) {
    throw new CustomError.NotFoundError(
      `No courses found with this id: ${courseId}`
    );
  }
  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getCourseReviews,
};
