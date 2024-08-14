const express = require('express');
const router = express.Router();
const {
  authenticatedUser,
  authorizePermissions,
} = require('../../middleware/authentication');
const {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
} = require('../../controllers/courseManagementController/courseController');

router
  .route('/courses')
  .post(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    createCourse
  )
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getAllCourses
  );

router
  .route('/:id/courses')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getSingleCourse
  )
  .patch(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    updateCourse
  )
  .delete(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    deleteCourse
  );

module.exports = router;
