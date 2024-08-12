const mongoose = require('mongoose');
const Tag = require('../models/Tag');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createCategory = async (req, res) => {
  const { name, description, subcategories = [], tags = [] } = req.body;
  const category = await Category.create({
    name,
    description,
    subcategories,
    tags,
  });

  // If [subcategories] found, link it to category
  if (subcategories.length > 0) {
    await Subcategory.updateMany(
      { _id: { $in: subcategories } },
      { $push: { categories: category._id } }
    );
  }

  // If [tags] found, link it to category
  if (tags.length > 0) {
    await Tag.updateMany(
      { _id: { $in: tags } },
      { $push: { categories: category._id } }
    );
  }

  res.status(StatusCodes.CREATED).json({ category });
};

const createTags = async (req, res) => {
  const tagsData = Array.isArray(req.body) ? req.body : [req.body]; // Handle both single or multiple objects
  if (tagsData.length === 0) {
    throw new CustomError.BadRequestError('Please provide at least one tag!');
  }

  const createdTags = [];

  for (const tagData of tagsData) {
    // Iteration Process for both values
    const { name, subcategories = [], categories = [] } = tagData;
    if (!name) {
      throw new CustomError.BadRequestError('Please provide at least one tag!');
    }
    const tag = await Tag.create({ name, subcategories, categories });

    // If [subcategories] found, link it to tags
    if (subcategories.length > 0) {
      await Subcategory.updateMany(
        { _id: { $in: subcategories } },
        { $push: { tags: tag._id } }
      );
    }

    // If [categories] found, link it to tags
    if (categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: categories } },
        { $push: { tags: tag._id } }
      );
    }
    createdTags.push(tag);
  }

  res.status(StatusCodes.CREATED).json({ createdTags });
};

const createSubcategories = async (req, res) => {
  const subcategoriesData = Array.isArray(req.body) ? req.body : [req.body];
  if (!subcategoriesData.length) {
    throw new CustomError.BadRequestError(
      'Please provide at least one subcategory!'
    );
  }
  const createdSubcategories = [];

  for (const subcategoryData of subcategoriesData) {
    const { name, description, tags = [], categories = [] } = subcategoryData;

    if (!name) {
      throw new CustomError.BadRequestError(
        'Please provide a subcategory name!'
      );
    }

    // Create the subcategory
    const subcategory = await Subcategory.create({
      name,
      description,
      tags,
      categories,
    });

    // Update Tags to include this subcategory
    if (tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tags } },
        { $push: { subcategories: subcategory._id } }
      );
    }

    // Update Categories to include this subcategory
    if (categories.length > 0) {
      const updateCategoriesResult = await Category.updateMany(
        { _id: { $in: categories } },
        { $push: { subcategories: subcategory._id } }
      );

      console.log('Categories update result:', updateCategoriesResult);
    }

    createdSubcategories.push(subcategory);
  }

  res.status(StatusCodes.CREATED).json({ createdSubcategories });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({})
    .populate({
      path: 'tags',
      select: 'name',
    })
    .populate({
      path: 'subcategories',
      select: 'name description',
    });
  res.status(StatusCodes.OK).json({ categories });
};

const getAllTags = async (req, res) => {
  const tags = await Tag.find({})
    .populate({
      path: 'categories',
      select: 'name description',
    })
    .populate({
      path: 'subcategories',
      select: 'name description',
    });
  res.status(StatusCodes.OK).json({ tags });
};

const getAllSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({})
    .populate({
      path: 'categories',
      select: 'name description',
    })
    .populate({
      path: 'tags',
      select: 'name',
    });
  res.status(StatusCodes.OK).json({ subcategories });
};

module.exports = {
  createCategory,
  createTags,
  createSubcategories,
  getAllCategories,
  getAllTags,
  getAllSubcategories,
};
