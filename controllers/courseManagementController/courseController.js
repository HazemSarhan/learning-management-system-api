const Course = require('../../models/Course');
const Category = require('../../models/Category');
const Section = require('../../models/Section');
const Tag = require('../../models/Tag');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { checkPermission, paginate } = require('../../utils');
const path = require('path');

const createCourse = async (req, res) => {
  const {
    title,
    description,
    instructor,
    requirements,
    sections = [],
    isPaid,
    featured,
    category,
    tags = [],
    price,
  } = req.body;

  const categoryValidate = await Category.findById(category);
  if (!categoryValidate) {
    throw new CustomError.NotFoundError(
      `No category found with this id ${category}`
    );
  }

  // Sections validate (Only if found sections)
  if (sections) {
    for (let sectionId of sections) {
      const sectionValidate = await Section.findById(sectionId);
      if (!sectionValidate) {
        throw new CustomError.NotFoundError(
          `No Section found with this id ${sectionId}`
        );
      }
    }
  }

  // Tags validate (Only if found tags)
  if (tags) {
    for (let tagId of tags) {
      const tagValidate = await Tag.findById(tagId);
      if (!tagValidate) {
        throw new CustomError.NotFoundError(
          `No Tags found with this id ${tagId}`
        );
      }
    }
  }

  checkPermission(req.user, instructor);

  // Upload course image to cloud
  let image = '/uploads/default_course_image.jpeg'; // default image
  if (req.files && req.files.image) {
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    image = result.secure_url;
  }

  const course = await Course.create({
    title,
    description,
    instructor,
    requirements,
    isPaid,
    featured,
    category,
    tags,
    price,
    image,
    sections,
  });

  await Section.updateMany(
    { _id: { $in: sections } }, // Update all sections and link it to the course
    { course: course._id },
    { new: true }
  );

  await Tag.updateMany(
    { _id: { $in: tags } }, // Update all tags and link it to the course
    { course: course._id },
    { new: true }
  );

  res.status(StatusCodes.CREATED).json({ course });
};

const getAllCourses = async (req, res) => {
  const course = await Course.find({})
    .populate({
      path: 'sections', // Populate sections
      populate: {
        path: 'lectures',
        select: 'title content',
      },
    })
    .populate({
      path: 'tags',
      select: 'name',
    })
    .populate({
      path: 'category',
      select: 'name',
    });
  res.status(StatusCodes.OK).json({ course });
};

const getSingleCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await Course.findById(courseId)
    .populate({
      path: 'sections', // Populate sections
      populate: {
        path: 'lectures',
        select: 'title content',
      },
    })
    .populate({
      path: 'tags',
      select: 'name',
    })
    .populate({
      path: 'category',
      select: 'name',
    });
  if (!course) {
    throw new CustomError.NotFoundError(
      `No courses found with id: ${courseId}`
    );
  }
  res.status(StatusCodes.OK).json({ course });
};

const updateCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const {
    title,
    description,
    sections = [],
    requirements,
    isPaid,
    featured,
    category,
    tags = [],
    price,
  } = req.body;

  const categoryValidate = await Category.findById(category);
  if (!categoryValidate) {
    throw new CustomError.NotFoundError(
      `No category found with this id ${category}`
    );
  }

  if (sections) {
    const sectionValidate = await Section.findById(sections);
    if (!sectionValidate) {
      throw new CustomError.NotFoundError(
        `No Section found with this id ${sections}`
      );
    }
  }

  if (tags) {
    for (let tagId of tags) {
      const tagValidate = await Tag.findById(tagId);
      if (!tagValidate) {
        throw new CustomError.NotFoundError(
          `No Tags found with this id ${tagId}`
        );
      }
    }
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new CustomError.NotFoundError(`No course found with id: ${courseId}`);
  }

  // Check permission for the same authenticated instructor only
  checkPermission(req.user, course.instructor);

  // Image updating
  let image = course.image; // default to existing uploaded image
  if (req.files && req.files.image) {
    // Upload the new image
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    image = result.secure_url;
  }

  course.title = title;
  course.description = description;
  course.sections = sections;
  course.requirements = requirements;
  course.isPaid = isPaid;
  course.featured = featured;
  course.category = category;
  course.tags = tags;
  course.price = price;
  course.image = image;
  await course.save();
  res.status(StatusCodes.OK).json({ course });
};

const deleteCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    throw new CustomError.NotFoundError(
      `No courses found with id: ${courseId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: `Course has been deleted!` });
};

module.exports = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
