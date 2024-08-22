const Course = require('../../models/Course');
const Category = require('../../models/Category');
const User = require('../../models/User');
const Section = require('../../models/Section');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');
const cloudinary = require('../../configs/cloudinaryConfig');
const fs = require('fs');
const { checkPermission, paginate } = require('../../utils');
const { resolveIds } = require('../../utils');

const createCourse = async (req, res) => {
  const {
    title,
    description,
    requirements,
    sections = [],
    isPaid,
    featured,
    category,
    price,
  } = req.body;

  const instructor = req.user.userId;

  const categoryIds = await resolveIds(category, Category, 'Category');

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
    category: categoryIds,
    price,
    image,
    sections,
  });

  if (price > 0) {
    course.isPaid = true;
  }

  // Update all sections and link it to the course
  await Section.updateMany(
    { _id: { $in: sections } },
    { course: course._id },
    { new: true }
  );

  // Update the instructor's uploadedCourses array
  await User.findByIdAndUpdate(
    instructor,
    { $push: { uploadedCourses: course._id } },
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
      path: 'category',
      select: 'name',
    });
  res.status(StatusCodes.OK).json({ course });
};

const getSingleCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await Course.findById(courseId)
    .populate({
      path: 'sections',
      select: 'title description lectures', // Populate sections
      populate: {
        path: 'lectures',
        select: 'title content',
      },
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
    price,
  } = req.body;

  const categoryIds = await resolveIds(category, Category, 'Category');

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
  course.requirements = requirements;
  course.isPaid = isPaid;
  course.featured = featured;
  course.category = categoryIds;
  course.price = price;
  course.image = image;
  await course.save();
  res.status(StatusCodes.OK).json({ course });
};

const deleteCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await Course.findByIdAndDelete(courseId);
  checkPermission(req.user, course.instructor);
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
