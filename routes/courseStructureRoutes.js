const express = require('express');
const router = express.Router();
const {
  createCategory,
  createTags,
  createSubcategories,
  getAllTags,
  getAllCategories,
  getAllSubcategories,
} = require('../controllers/courseStructureController');

router.post('/category', createCategory);
router.post('/tags', createTags);
router.post('/subcategory', createSubcategories);
router.get('/tags', getAllTags);
router.get('/category', getAllCategories);
router.get('/subcategory', getAllSubcategories);

module.exports = router;
