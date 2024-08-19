const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('../controllers/courseReviewController');
const {
  authenticatedUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .post([authenticatedUser], createReview)
  .get([authenticatedUser, authorizePermissions('admin')], getAllReviews);

router
  .route('/:id')
  .get([authenticatedUser, authorizePermissions('admin')], getReviewById)
  .patch([authenticatedUser, authorizePermissions('admin')], updateReview)
  .delete([authenticatedUser, authorizePermissions('admin')], deleteReview);

module.exports = router;
