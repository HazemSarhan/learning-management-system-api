const Course = require('../../models/Course');
const Section = require('../../models/Section');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');

const createSection = async (req, res) => {
  // Find course by courseId
  const { id: courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new CustomError.NotFoundError(`No course found with id: ${courseId}`);
  }

  // Create section
  const { title, description } = req.body;
  const section = await Section.create({
    title,
    description,
    course: courseId,
  });

  // Update course with the new section
  if (course) {
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { sections: section._id } },
      { new: true }
    );
  }

  res.status(StatusCodes.CREATED).json({ section });
};

const getAllSections = async (req, res) => {
  const section = await Section.find({})
    .populate({
      path: 'course',
      select: 'title instructor students',
    })
    .populate({
      path: 'lectures',
      select: 'title',
    });
  res.status(StatusCodes.OK).json({ section });
};

const getSingleSection = async (req, res) => {
  const { id: sectionId } = req.params;
  const section = await Section.findById(sectionId)
    .populate({
      path: 'course',
      select: 'title instructor students',
    })
    .populate({
      path: 'lectures',
      select: 'title',
    });
  if (!section) {
    throw new CustomError.NotFoundError(
      `No sections found with id: ${sectionId}`
    );
  }
  res.status(StatusCodes.OK).json({ section });
};

const updateSection = async (req, res) => {
  const { id: sectionId } = req.params;
  const { title, description } = req.body;
  const section = await Section.findById(sectionId);
  if (!section) {
    throw new CustomError.NotFoundError(
      `No sections found with id: ${sectionId}`
    );
  }
  section.title = title;
  section.description = description;
  await section.save();
  res.status(StatusCodes.OK).json({ section });
};

const deleteSection = async (req, res) => {
  const { id: sectionId } = req.params;
  const section = await Section.findByIdAndDelete(sectionId);
  if (!section) {
    throw new CustomError.NotFoundError(
      `No sections found with id: ${sectionId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: `Section has been deleted!` });
};

module.exports = {
  createSection,
  getAllSections,
  getSingleSection,
  updateSection,
  deleteSection,
};
