const express = require('express');
const router = express.Router();
const {
  authenticatedUser,
  authorizePermissions,
} = require('../../middleware/authentication');
const {
  createSection,
  getAllSections,
  getSingleSection,
  updateSection,
  deleteSection,
} = require('../../controllers/courseManagementController/sectionController');

router
  .route('/section')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getAllSections
  );

router
  .route('/:id/section')
  .post(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    createSection
  )
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getSingleSection
  )
  .delete(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    deleteSection
  )
  .patch(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    updateSection
  );

module.exports = router;
