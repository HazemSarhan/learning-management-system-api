const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  changeUserRole,
} = require('../controllers/userController');
const {
  getSpecificOrderUser,
} = require('../controllers/courseEnrollmentController');

const {
  authenticatedUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .get([authenticatedUser, authorizePermissions('admin')], getAllUsers);

router.route('/showMe').get([authenticatedUser], showCurrentUser);

router.route('/updateUser').patch([authenticatedUser], updateUser);
router
  .route('/updateUserPassword')
  .patch([authenticatedUser], updateUserPassword);

router
  .route('/:id')
  .get([authenticatedUser, authorizePermissions('admin')], getSingleUser);

router
  .route('/:id/orders')
  .get(
    [authenticatedUser, authorizePermissions('admin')],
    getSpecificOrderUser
  );

router
  .route('/:id/roles')
  .post([[authenticatedUser, authorizePermissions('admin')], changeUserRole]);

module.exports = router;
