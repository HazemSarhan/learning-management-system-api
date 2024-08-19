const express = require('express');
const router = express.Router();
const {
  purchaseCourse,
  getAllPurchasedCourses,
  paymentSuccess,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/courseEnrollmentController');
const {
  authenticatedUser,
  authorizePermissions,
} = require('../middleware/authentication');

router.route('/').post([authenticatedUser], purchaseCourse);

router.route('/success').get(paymentSuccess);
router.route('/cancel').get(purchaseCourse);

router
  .route('/orders')
  .get([
    authenticatedUser,
    authorizePermissions('admin'),
    getAllPurchasedCourses,
  ]);

router
  .route('/:id')
  .get([authenticatedUser, authorizePermissions('admin')], getSingleOrder)
  .patch([authenticatedUser, authorizePermissions('admin')], updateOrderStatus)
  .delete([authenticatedUser, authorizePermissions('admin')], deleteOrder);

module.exports = router;
