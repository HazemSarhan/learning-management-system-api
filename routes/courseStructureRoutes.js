const express = require('express');
const router = express.Router();
const {
  createCategory,
  createTags,
  createSubcategories,
  getAllTags,
  getAllCategories,
  getAllSubcategories,
  getSingleCategory,
  getSingleTag,
  getSingleSubcategory,
  updateCategory,
  deleteCategory,
  updateTag,
  deleteTag,
  updateSubcategory,
  deleteSubcategory,
} = require('../controllers/courseStructureController');

const {
  authenticatedUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/category')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getAllCategories
  )
  .post(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    createCategory
  );

router
  .route('/tag')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getAllTags
  )
  .post(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    createTags
  );

router
  .route('/subcategory')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getAllSubcategories
  )
  .post(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    createSubcategories
  );

router
  .route('/category/:id')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getSingleCategory
  )
  .patch(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    updateCategory
  )
  .delete(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    deleteCategory
  );

router
  .route('/tag/:id')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getSingleTag
  )
  .patch(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    updateTag
  )
  .delete(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    deleteTag
  );

router
  .route('/subcategory/:id')
  .get(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    getSingleSubcategory
  )
  .patch(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    updateSubcategory
  )
  .delete(
    [authenticatedUser, authorizePermissions('admin', 'instructor')],
    deleteSubcategory
  );

module.exports = router;
