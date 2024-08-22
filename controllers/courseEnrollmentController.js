require('dotenv').config();
const stripe = require('../configs/stripeConfig');
const Order = require('../models/Order');
const User = require('../models/User');
const Course = require('../models/Course');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const { paginate } = require('../utils');
const { mailtrapClient, sender } = require('../configs/mailtrapConfig');

const purchaseCourse = async (req, res) => {
  const { courseId } = req.body;
  // Check for course availablilty
  const course = await Course.findById(courseId);
  if (!course) {
    throw new CustomError.NotFoundError(
      `No courses found with id: ${courseId}`
    );
  }

  // Check if the user already have the course!
  if (course.students.includes(req.user.userId)) {
    throw new CustomError.BadRequestError(`You already have this course!`);
  }

  // Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.description,
          },
          unit_amount: course.price * 100, // [Cause of Stripe cents]
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/payments/cancel`,
    metadata: {
      courseId: course.id.toString(),
      studentId: req.user.userId.toString(),
    },
  });

  // Create Order
  const order = await Order.create({
    student: req.user.userId,
    course: course._id,
    price: course.price,
    paymentStatus: 'pending',
    stripeSessionId: session.id,
  });

  res.status(StatusCodes.CREATED).json({ id: session.id, url: session.url });
};

const paymentSuccess = async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).send('Session ID is missing');
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Find the order with this session
  const order = await Order.findOne({ stripeSessionId: session.id });
  if (!order) {
    return res.status(404).send('Order not found');
  }

  // Update the order status to 'completed'
  order.paymentStatus = 'completed';
  order.purchasedAt = new Date();
  await order.save();

  // Find the user with this order
  const user = await User.findById(order.student);
  if (!user.purchasedCourses) {
    user.purchasedCourses = [];
  }

  // Add the course to the user's purchasedCourses list
  user.purchasedCourses.push(order.course);
  await user.save();

  // Add the student to course's students list
  const courseId = order.course.toString();
  const course = await Course.findById(courseId);
  course.students.push(user._id.toString());
  await course.save();

  try {
    await mailtrapClient.send({
      from: sender,
      // to: [{ email: user.email }], // if (mailtrap member => paid)
      to: [{ email: `${process.env.MY_EMAIL}` }], // if (mailtrap member => demo 'free' , use your mailtrap email to recieve the message)
      subject: 'Course Purchase Confirmation',
      text: `Hi ${user.name},\n\nYou have successfully purchased the course: ${course.title}.`,
      html: `<h1>Hi ${user.name},</h1><p>You have successfully purchased the course: <strong>${course.title}</strong>.</p>`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }

  res
    .status(200)
    .sendFile(path.join(__dirname, '../public/frontend', 'success.html'));
};

const getAllPurchasedCourses = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort,
    fields,
    numericFilters,
    status,
  } = req.query;

  const queryObject = {};
  if (status) {
    queryObject.paymentStatus = status;
  }

  const options = {
    page,
    limit,
    sort,
    fields,
    numericFilters,
    populate: { path: 'course', select: 'title  ' },
  };
  const { results: orders, pagination } = await paginate(
    Order,
    queryObject,
    options
  );
  res.status(StatusCodes.OK).json({ orders, meta: { pagination } });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId).populate({
    path: 'course',
    select: 'title',
  });
  if (!order) {
    throw new CustomError.NotFoundError(`No courses found with id ${order}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

const getSpecificOrderUser = async (req, res) => {
  const userId = req.params.id;
  const order = await Order.find({ student: userId });
  if (!order) {
    throw new CustomError.NotFoundError(
      `No orders found with this userId: ${userId}`
    );
  }
  res.status(StatusCodes.OK).json({ order });
};

const updateOrderStatus = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentStatus } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new CustomError.NotFoundError(
      `No orders found with this id: ${orderId}`
    );
  }
  order.paymentStatus = paymentStatus;
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

const deleteOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) {
    throw new CustomError.NotFoundError(
      `No orders found with this id: ${orderId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: `Order has been deleted!` });
};

module.exports = {
  purchaseCourse,
  paymentSuccess,
  getAllPurchasedCourses,
  getSingleOrder,
  getSpecificOrderUser,
  updateOrderStatus,
  deleteOrder,
};
