const mongoose = require('mongoose');
const Tag = require('../models/Tag');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createTags = async (req, res) => {
  const tagsData = Array.isArray(req.body) ? req.body : [req.body]; // Handle both array and single object
  if (tagsData.length === 0) {
    throw new CustomError.BadRequestError(
      'You must provide at least one tag!.'
    );
  }

  const createdTags = [];

  // Iterate over each tag object in the array
  for (const tagData of tagsData) {
    const { name, subcategories } = tagData;
    let subcategoriesId = [];

    // Process subcategories if provided
    if (subcategories && Array.isArray(subcategories)) {
      subcategoriesId = await Promise.all(
        subcategories.map(async (subcategory) => {
          if (mongoose.Types.ObjectId.isValid(subcategory)) {
            return subcategory; // If there's SubcategoryId use it directly
          } else {
            const foundSubcategory = await Subcategory.findOne({
              name: subcategory,
            });
            if (foundSubcategory) {
              return foundSubcategory._id; // Return the SubcategoryId if the subcategory name exists
            } else {
              throw new CustomError.NotFoundError(
                `No Subcategory found with name: ${subcategory}`
              );
            }
          }
        })
      );
    }

    // Create the tag, with or without subcategories
    const tag = await Tag.create({ name, subcategories: subcategoriesId });

    // Update subcategories automatically if any subcategories were provided
    if (subcategoriesId.length > 0) {
      await Subcategory.updateMany(
        { _id: { $in: subcategoriesId } }, // Find Subcategory by id
        { $push: { tags: tag._id } } // Add tagId to each subcategory's tags array
      );
    }

    createdTags.push(tag);
  }

  res.status(StatusCodes.CREATED).json({ createdTags });
};

const getAllTags = async (req, res) => {
  const tags = await Tag.find({});
  res.status(StatusCodes.OK).json({ tags });
};

const createSubcategory = async (req, res) => {
  // To accept both: signle & multiple categories
  const subcategoriesData = Array.isArray(req.body) ? req.body : [req.body];
  if (subcategoriesData.length === 0) {
    throw new CustomError.BadRequestError('Must provide at least one category');
  }

  const createdSubcategories = [];

  // Iteration
  for (const subcategoryData of subcategoriesData) {
    const { name, description, tags } = subcategoryData;
    let tagsId = [];

    // Process tags if provided
    if (tags && Array.isArray(tags)) {
      tagsId = await Promise.all(
        tags.map(async (tag) => {
          if (mongoose.Types.ObjectId.isValid(tag)) {
            return tag; // If there's TagsId use it directly
          } else {
            const foundTag = await Tag.findOne({ name: tag });
            if (foundTag) {
              return foundTag._id; // Return the TagsId if the Tag name exists
            } else {
              throw new CustomError.NotFoundError(`Tag not found: ${tag}`);
            }
          }
        })
      );
    }

    // Create the subcategory, with or without tags
    const subcategory = await Subcategory.create({
      name,
      description,
      tags: tagsId,
    });

    // Update each tag to include this subcategory
    if (tagsId.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tagsId } }, // Find tags by their IDs
        { $push: { subcategories: subcategory._id } } // Add the subcategory ID to each tag's subcategories array
      );
    }

    createdSubcategories.push(subcategory);
  }

  res.status(StatusCodes.CREATED).json({ createdSubcategories });
};

const getAllSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({});
  res.status(StatusCodes.OK).json({ subcategories });
};

const createCategory = async (req, res) => {
  const { name, description, subcategories, tags } = req.body;

  let subcategoriesId = [];

  // If were a subcategories added.
  if (subcategoriesId && Array.isArray(subcategoriesId)) {
    // Mapping to get names from subcategoryIds to parse data with both [subcategory.name || subcategory._id]
    subcategoriesId = await Promise.all(
      subcategories.map(async (subcategory) => {
        if (mongoose.Types.ObjectId.isValid(subcategory)) {
          return subcategory;
        } else {
          const subcategories = await Subcategory.findOne({
            name: subcategory,
          });
          if (subcategories) {
            return subcategories._id;
          } else {
            throw new CustomError.NotFoundError(
              `No Subcategory found ${subcategory}`
            );
          }
        }
      })
    );
  }

  let tagsId = [];
  if (tags && Array.isArray(tags)) {
    tagsId = await Promise.all(
      tags.map(async (tag) => {
        if (mongoose.Types.ObjectId.isValid(tag)) {
          return tag;
        } else {
          const tags = await Tag.findOne({ name: tag });
          if (tags) {
            return tags._id;
          } else {
            throw new CustomError.NotFoundError(`Tag not found ${tag}`);
          }
        }
      })
    );
  }

  const category = await Category.create({
    name,
    description,
    subcategories: subcategoriesId,
    tags: tagsId,
  });

  if (subcategoriesId.length > 0) {
    await Subcategory.updateMany(
      { _id: { $in: subcategoriesId } },
      { $push: { categories: category._id } } // Assuming you have a categories field in Subcategory schema
    );
  }

  // Update each tag to include this category
  if (tagsId.length > 0) {
    await Tag.updateMany(
      { _id: { $in: tagsId } },
      { $push: { categories: category._id } } // Assuming you have a categories field in Tag schema
    );
  }

  console.log(tagsId);
  console.log(subcategoriesId);
  res.status(StatusCodes.CREATED).json({ category });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(StatusCodes.OK).json({ categories });
};

module.exports = {
  createTags,
  getAllTags,
  createSubcategory,
  getAllSubcategories,
  createCategory,
  getAllCategories,
};
