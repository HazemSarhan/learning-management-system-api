const express = require('express');
const router = express.Router();
const {
  createLecture,
  getAllLectures,
  getSingleLecture,
  updateLecture,
  deleteLecture,
} = require('../../controllers/courseManagementController/lectureController');
const {
  authenticatedUser,
  authorizePermissions,
} = require('../../middleware/authentication');

router
  .route('/lectures')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getAllLectures
  );

router
  .route('/:id/lecture')
  .post([
    authenticatedUser,
    authorizePermissions('admin', 'instructor'),
    createLecture,
  ])
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getSingleLecture
  )
  .patch(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    updateLecture
  )
  .delete(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    deleteLecture
  );

module.exports = router;
