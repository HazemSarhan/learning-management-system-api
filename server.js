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
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// DB Connection
const connectDB = require('./db/connect');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseStructureRoute = require('./routes/courseStructureRoutes');

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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/course/structure', courseStructureRoute);

app.get('/', (req, res) => {
  res.send(`<h1>Learning Management System API</h1>`);
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
