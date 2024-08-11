const express = require('express');
const router = express.Router();
const {
  createTags,
  getAllTags,
  createSubcategory,
  getAllSubcategories,
  createCategory,
  getAllCategories,
} = require('../controllers/courseStructureController');

router.route('/tags').post(createTags).get(getAllTags); // => Tags Route
router.route('/subcategory').post(createSubcategory).get(getAllSubcategories); // => Subcategories Route
router.route('/category').post(createCategory).get(getAllCategories); // => Categories Route

module.exports = router;
