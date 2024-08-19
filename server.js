// Main server
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');

// Rest of packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('./configs/cloudinaryConfig');

// DB Connection
const connectDB = require('./db/connect');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseStructureRoutes = require('./routes/courseStructureRoutes');
// Course Management Routes
const createCourse = require('./routes/courseManagementRoutes/courseRoutes');
const createSection = require('./routes/courseManagementRoutes/sectionRoutes');
const createLecture = require('./routes/courseManagementRoutes/lectureRoutes');

const courseEnrollmentsRoutes = require('./routes/courseEnrollmentRoutes');

const courseReviewRoutes = require('./routes/courseReviewRoutes');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, './public')));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/uploads/tmp',
  })
);

// Users & Auth
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Course Structure [Category, Subcategory, Order]
app.use('/api/v1/course/structure', courseStructureRoutes);

// Course Management
app.use('/api/v1/course/management', createCourse);
app.use('/api/v1/course/management', createSection);
app.use('/api/v1/course/management', createLecture);

// Payments
app.use('/api/v1/course/payments', courseEnrollmentsRoutes);

// Reviews
app.use('/api/v1/course/reviews', courseReviewRoutes);

app.get('/', (req, res) => {
  res.send(`<h1>Learning Management System API</h1>`);
});

app.get('/order-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/frontend', 'order-test.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/frontend', 'login.html'));
});

app.get('/api/v1/payments/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/frontend', 'success.html'));
});

app.get('/api/v1/payments/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/frontend', 'cancel.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server Running
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
