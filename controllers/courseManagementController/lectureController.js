const Course = require('../../models/Course');
const Section = require('../../models/Section');
const Lecture = require('../../models/Lecture');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createLecture = async (req, res) => {
  const { id: sectionId } = req.params;
  const section = await Section.findById(sectionId);
  if (!section) {
    throw new CustomError.NotFoundError(
      `No section found with id: ${sectionId}`
    );
  }

  const { title, isPreview } = req.body;

  let content = [];
  let type = 'text';
  let duration = '';

  if (req.files && req.files.content) {
    const files = Array.isArray(req.files.content)
      ? req.files.content
      : [req.files.content];
    for (const file of files) {
      const fileFormat = file.mimetype;

      if (fileFormat.startsWith('image')) {
        type = 'image';
      } else if (fileFormat.startsWith('video')) {
        type = 'video';
      } else if (fileFormat === 'application/pdf') {
        type = 'pdf';
      }

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        use_filename: true,
        folder: 'lms-content',
        resource_type: type === 'video' ? 'video' : 'auto',
      });
      fs.unlinkSync(file.tempFilePath);
      content.push(result.secure_url);
    }
  } else {
    content.push('/uploads/course-content.mp4'); // Default URL
  }

  const lecture = await Lecture.create({
    title,
    type,
    duration,
    content,
    isPreview,
    section: sectionId,
  });

  // Add the new lecture to the section
  await Section.findByIdAndUpdate(sectionId, {
    $push: { lectures: lecture._id },
  });

  res.status(StatusCodes.CREATED).json({ lecture });
};

const getAllLectures = async (req, res) => {
  const lecture = await Lecture.find({}).populate({
    path: 'section',
    select: 'title description course',
    populate: {
      path: 'course',
      select: 'title price instructor students',
    },
  });
  res.status(StatusCodes.OK).json({ lecture });
};

const getSingleLecture = async (req, res) => {
  const { id: lectureId } = req.params;
  const lecture = await Lecture.findById(lectureId).populate({
    path: 'section',
    select: 'title description course',
    populate: {
      path: 'course',
      select: 'title price instructor students',
    },
  });
  if (!lecture) {
    throw new CustomError.NotFoundError(
      `No lectures found with id ${lectureId}`
    );
  }
  res.status(StatusCodes.OK).json({ lecture });
};

const updateLecture = async (req, res) => {
  const { id: lectureId } = req.params;
  const lectureExist = await Lecture.findById(lectureId);
  if (!lectureExist) {
    throw new CustomError.NotFoundError(
      `No lectures found with id: ${lectureId}`
    );
  }

  const { title, duration, isPreview } = req.body;

  let content = '/uploads/course-content.mp4';
  let type = 'text';

  if (req.files && req.files.content) {
    const fileFormat = req.files.content.mimetype;
    console.log(fileFormat);

    // Checking the content type
    if (fileFormat.startsWith('image')) {
      type = 'image';
    } else if (fileFormat.startsWith('video')) {
      type = 'video';
    } else if (fileFormat === 'application/pdf') {
      type = 'pdf';
    } else {
      type = 'text';
    }

    // Upload the content based on it's type
    const result = await cloudinary.uploader.upload(
      req.files.content.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-content',
        resource_type: type === 'video' ? 'video' : 'auto',
      }
    );
    fs.unlinkSync(req.files.content.tempFilePath);
    content = result.secure_url;
  }

  const lecture = await Lecture.findById(lectureId);
  lecture.title = title;
  lecture.content = content;
  lecture.duration = duration;
  lecture.isPreview = isPreview;
  lecture.type = type;
  await lecture.save();
  res.status(StatusCodes.OK).json({ lecture });
};

const deleteLecture = async (req, res) => {
  const { id: lectureId } = req.params;
  const lecture = await Lecture.findByIdAndDelete(lectureId);
  if (!lecture) {
    throw new CustomError.NotFoundError(
      `No lectures found with id ${lectureId}`
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Lecture has been deleted successfully!' });
};

module.exports = {
  createLecture,
  getAllLectures,
  getSingleLecture,
  updateLecture,
  deleteLecture,
};
