const Tag = require('../models/Tag');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { resolveIds } = require('../utils');

// Categories
/*
const createCategory = async (req, res) => {
  const { name, description, subcategories = [] } = req.body;

  const subcategoryIds = await resolveIds(
    subcategories,
    Subcategory,
    'Subcategory'
  );

  const category = await Category.create({
    name,
    description,
    subcategories: subcategoryIds,
  });

  // If [subcategories] found, link it to category
  if (subcategoryIds.length > 0) {
    await Subcategory.updateMany(
      { _id: { $in: subcategoryIds } },
      { $push: { categories: category._id } }
    );
  }

  res.status(StatusCodes.CREATED).json({ category });
};
*/

const createCategory = async (req, res) => {
  const categoriesData = Array.isArray(req.body) ? req.body : [req.body]; // Handle both single or multiple objects
  if (categoriesData.length === 0) {
    throw new CustomError.BadRequestError(
      'Please provide at least one category!'
    );
  }

  const createdCategories = [];

  for (const categoryData of categoriesData) {
    // Iteration Process for both values
    const { name, description, subcategories = [] } = categoryData;
    if (!name) {
      throw new CustomError.BadRequestError(
        'Please provide at least one category!'
      );
    }

    // Finding names instead of subcategoryIds
    const subcategoryIds = await resolveIds(
      subcategories,
      Subcategory,
      'Subcategory'
    );

    const category = await Category.create({
      name,
      description,
      subcategories: subcategoryIds,
    });

    // If subcategories found, link it to tags:
    if (subcategoryIds.length > 0) {
      await Subcategory.updateMany(
        { _id: { $in: subcategoryIds } },
        { $push: { categories: category._id } }
      );
    }
    createdCategories.push(category);
  }
  res.status(StatusCodes.CREATED).json({ createdCategories });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({}).populate({
    path: 'subcategories',
    select: 'name description tags',
    populate: {
      path: 'tags',
      select: 'name',
    },
  });
  res.status(StatusCodes.OK).json({ categories });
};

const getSingleCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await Category.findById(categoryId).populate({
    path: 'subcategories',
    select: 'name description tags',
    populate: {
      path: 'tags',
      select: 'name',
    },
  });
  if (!category) {
    throw new CustomError.NotFoundError(
      `No category found with id: ${categoryId}`
    );
  }
  res.status(StatusCodes.OK).json({ category });
};

const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { name, description, subcategories = [], tags = [] } = req.body;
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new CustomError.NotFoundError(
      `No category found with id: ${categoryId}`
    );
  }
  category.name = name;
  category.description = description;
  category.subcategories = subcategories;
  category.tags = tags;
  await category.save();

  res.status(StatusCodes.OK).json(category);
};

const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new CustomError.NotFoundError(
      `No category found with id: ${categoryId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: `category has been deleted!` });
};

// Tags
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

    // If found names instead ID
    const subcategoryIds = await resolveIds(
      subcategories,
      Subcategory,
      'Subcategory'
    );
    const categoryIds = await resolveIds(categories, Category, 'Category');

    const tag = await Tag.create({
      name,
      subcategories: subcategoryIds,
      categories: categoryIds,
    });

    // If [subcategories] found, link it to tags
    if (subcategoryIds.length > 0) {
      await Subcategory.updateMany(
        { _id: { $in: subcategoryIds } },
        { $push: { tags: tag._id } }
      );
    }

    // If [categories] found, link it to tags
    if (categoryIds.length > 0) {
      await Category.updateMany(
        { _id: { $in: categoryIds } },
        { $push: { tags: tag._id } }
      );
    }
    createdTags.push(tag);
  }

  res.status(StatusCodes.CREATED).json({ createdTags });
};

const getAllTags = async (req, res) => {
  const tags = await Tag.find({}).populate({
    path: 'subcategories',
    select: 'name description categories',
    populate: {
      path: 'categories',
      select: 'name description',
    },
  });
  res.status(StatusCodes.OK).json({ tags });
};

const getSingleTag = async (req, res) => {
  const { id: tagId } = req.params;
  const tag = await Tag.findById(tagId).populate({
    path: 'subcategories',
    select: 'name description',
  });
  if (!tag) {
    throw new CustomError.NotFoundError(`No tag found with id: ${tagId}`);
  }
  res.status(StatusCodes.OK).json({ tag });
};

const updateTag = async (req, res) => {
  const { id: tagId } = req.params;
  const { name, subcategories = [], categories = [] } = req.body;
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new CustomError.NotFoundError(`No tag found with id: ${tagId}`);
  }
  tag.name = name;
  tag.subcategories = subcategories;
  tag.categories = categories;
  await tag.save();
  res.status(StatusCodes.OK).json({ tag });
};

const deleteTag = async (req, res) => {
  const { id: tagId } = req.params;
  const tag = await Tag.findByIdAndDelete(tagId);
  if (!tag) {
    throw new CustomError.NotFoundError(`No tag found with id: ${tagId}`);
  }
  res.status(StatusCodes.OK).json({ msg: `Tag has been deleted!` });
};

// Subcategories
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

    // If found names instead ID
    const tagIds = await resolveIds(tags, Tag, 'Tag');
    const categoryIds = await resolveIds(categories, Category, 'Category');

    // Create the subcategory
    const subcategory = await Subcategory.create({
      name,
      description,
      tags: tagIds,
      categories: categoryIds,
    });

    // Update Tags to include this subcategory
    if (tagIds.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tagIds } },
        { $push: { subcategories: subcategory._id } }
      );
    }

    // Update Categories to include this subcategory
    if (categoryIds.length > 0) {
      await Category.updateMany(
        { _id: { $in: categoryIds } },
        { $push: { subcategories: subcategory._id } }
      );
    }

    createdSubcategories.push(subcategory);
  }

  res.status(StatusCodes.CREATED).json({ createdSubcategories });
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

const getSingleSubcategory = async (req, res) => {
  const { id: subcategoryId } = req.params;
  const subcategory = await Subcategory.findById(subcategoryId)
    .populate({
      path: 'categories',
      select: 'name description',
    })
    .populate({
      path: 'tags',
      select: 'name',
    });
  if (!subcategory) {
    throw new CustomError.NotFoundError(
      `Subcategory not found: ${subcategoryId}`
    );
  }
  res.status(StatusCodes.OK).json({ subcategory });
};

const updateSubcategory = async (req, res) => {
  const { id: subcategoryId } = req.params;
  const { name, description, tags = [], categories = [] } = req.body;
  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) {
    throw new CustomError.NotFoundError(
      `Subcategory not found: ${subcategoryId}`
    );
  }
  subcategory.name = name;
  subcategory.description = description;
  subcategory.tags = tags;
  subcategory.categories = categories;
  await subcategory.save();
  res.status(StatusCodes.OK).json({ subcategory });
};

const deleteSubcategory = async (req, res) => {
  const { id: subcategoryId } = req.params;
  const subcategory = await Subcategory.findByIdAndDelete(subcategoryId);
  if (!subcategory) {
    throw new CustomError.NotFoundError(
      `Subcategory not found: ${subcategoryId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: `Subcategory has been deleted!` });
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  createTags,
  getAllTags,
  getSingleTag,
  updateTag,
  deleteTag,
  createSubcategories,
  getAllSubcategories,
  getSingleSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
