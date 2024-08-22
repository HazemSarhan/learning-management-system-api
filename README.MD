[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/HazemSarhan/learning-management-system-api">
    <img src="https://claned.com/wp-content/uploads/2023/06/What-is-API-Integration-in-LMS.jpg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">[Learning Management System]</h3>

  <p align="center">
    Comprehensive backend API for a Learning Management System [LMS] that provides functionalities for managing users courses, reviews, orders, and payments. This API is built using Node.js, Express, and MongoDB.
    <br />
    <a href="http://localhost:5000/api-docs/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://localhost:5000">View Demo</a>
    ·
    <a href="https://github.com/HazemSarhan/learning-management-system-api/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/HazemSarhan/learning-management-system-api/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Features](#features)
- [Getting Started & Installation](#getting-started)
- [Environment Variables](#environment-variables)
- [Models](#models)
- [Routes](#routes)
- [Usage](#usage)
- [License](#license)

## Features

Built with:

- [![Node][node-js]]
- [![Express][express-js]]
- [![MongoDB][mongo-db]]
- [![JWt][jwt]]

* Cloudinary [For Image Uploading]
* Stripe [For Payments & Orders]
* Mailtrap.io [For Receiving Order Confirmation Messages]

## Getting Started & Installation

```sh
git clone https://github.com/HazemSarhan/learning-management-system-api.git
cd lms-api
npm install
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT = 5000
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret
JWT_LIFETIME = 1d
CLOUD_NAME = your_cloudinary_name
CLOUD_API_KEY = your_cloudinary_api_key
CLOUD_API_SECRET = your_cloudinary_api_secret
STRIPE_SECRET_KEY = your_stripe_secret_key
STRIPE_WEBHOOK_SECRET = your_stripe_webhook_secret
MAILTRAP_ENDPOINT = your_mailtrap_endpoint
MAILTRAP_TOKEN = your_mailtrap_token
MAILTRAP_SENDER_EMAIL = mailtrap@demomailtrap.com
MAILTRAP_SENDER_NAME = LMS-API
FRONTEND_SUCCESS = http://localhost:5000/api/v1/payments/success
MY_EMAIL = same_mailtrap_email
```

## Models

<picture>
  <img alt="DB Design" src="https://imgur.com/a/zG2srDo">
</picture>

Check full model design [DB Design](https://drawsql.app/teams/drag0ns-team/diagrams/lms).

## Routes

- [ ] Authentication
      POST `/api/v1/auth/register` - Register a new user
      POST `/api/v1/auth/login` - Login a user
      POST `/api/v1/auth/logout` - Logout a user

- [ ] Users
      GET `/api/v1/users` - Get all users
      GET `/api/v1/users/:id` - Get a single user by ID
      GET `/api/v1/users/showMe` - Show current user data
      PATCH `/api/v1/users/updateUser` - Update user data
      PATCH `/api/v1/users/updateUserPassword` - Update user password
      GET `/api/v1/users/:id/orders` - Get all orders for specific user [userId]

- [ ] Course Structure Workflow [Tags, Subcategories, Categories]

  - [ ] Tags
        POST `/api/v1/course/structure/tag` - Create a new tag
        GET `/api/v1/course/structure/tag` - Get all tags
        GET `/api/v1/course/structure/tag/:id` - Get a single tag by tagId
        PATCH `/api/v1/course/structure/tag/:id` - Update a tag
        DELETE `/api/v1/course/structure/tag/:id` - Delete a tag

  - [ ] Subcategories
        POST `/api/v1/course/structure/subcategory` - Create a new subcategory
        GET `/api/v1/course/structure/subcategory` - Get all subcategories
        GET `/api/v1/course/structure/subcategory/:id` - Get a single subcategory by subcategoryId
        PATCH `/api/v1/course/structure/subcategory/:id` - Update a subcategory
        DELETE `/api/v1/course/structure/subcategory/:id` - Delete a subcategory

  - [ ] Categories
        POST `/api/v1/course/structure/category` - Create a new category
        GET `/api/v1/course/structure/category` - Get all categories
        GET `/api/v1/course/structure/category/:id` - Get a single category by categoryId
        PATCH `/api/v1/course/structure/category/:id` - Update a category
        DELETE `/api/v1/course/structure/category/:id` - Delete a category

- [ ] Course Management [Courses, Sections, Lectures]

  - [ ] Courses
        POST `/api/v1/course/management/courses` - Create a new course
        GET `/api/v1/course/management/courses` - Get all courses
        GET `/api/v1/course/management/courses/:id` - Get a single course
        PATCH `/api/v1/course/management/courses/:id` - Update a course
        DELETE `/api/v1/course/management/courses/:id` - Delete a course
        GET `/api/v1//course/management/:id/reviews` - Get a course reviews by courseId

  - [ ] Sections
        POST `/api/v1/course/management/:id/section` - Create a new section using courseId
        GET `/api/v1/course/management/section` - Get all sections
        GET `/api/v1/course/management/:id/section` - Get a single section
        PATCH `/api/v1/course/management/:id/section` - Update a section
        DELETE `/api/v1/course/management/:id/section` - Delete a section

  - [ ] Sections
        POST `/api/v1/course/management/:id/lecture` - Create a new lecture using sectionId
        GET `/api/v1/course/management/lectures` - Get all lectures
        GET `/api/v1/course/management/:id/lecture` - Get a single lecture
        PATCH `/api/v1/course/management/:id/lecture` - Update a lecture
        DELETE `/api/v1/course/management/:id/lecture` - Delete a lecture

- [ ] Course Enrollments [Order]
      POST `/api/v1/course/payments` - Create a new order [body => courseId: "required"]
      GET `/api/v1/course/payments` - Get all orders
      GET `/api/v1//course/payments/success?session_id={sessionId}` - Manually success the paymentStatus
      GET `/course/payments/:id` Get single order using orderId
      PATCH `/course/payments/:id` Update order status [paymentStatus]
      DELETE `/course/payments/:id` Delete order

- [ ] Course Reviews
      POST `/api/v1/course/reviews` - Create course review [Students only route]
      GET `/api/v1/course/reviews` - Get all reviews [All Courses]
      GET `/api/v1/course/reviews/:id` - Get a single review using reviewId
      PATCH `/api/v1/course/reviews/:id` - Update review
      DELETE `/api/v1/course/reviews/:id` - Delete review

## Usage

After creating .env with all [Environment Variables](#environment-variables) :

1. Run the server using:

```sh
npm start
```

2. Register a new user.

> [!TIP]
> Use your real email, you'll need it for order confirmation message [SMTP- MAILTRAP]
> First registered account role will automatically set to => admin

3. Course Structure Workflow [Tags, Subcategories, Categories]:

> [!IMPORTANT]
> For the best experience as the first item, Please create the course workflow structure in order, 1- Create tags, 2- Create subcategories, 3- Create category
> After creating first items for each one, you can easily create new item and link them together using itemId, check the documentation for more info!

4. Course Management [Courses, Sections, Lectures]:
   Imaging process & uploading using cloud => 'Cloudinary'.

> [!NOTE]
> Ensure you link your 'Cloudinary' api to your .env file , [Environment Variables](#environment-variables).

        - Create a new course
        - Create a new section using [courseId]
        - Create a new lecture using [sectionId]

5. Course Enrollments [Orders]:

> [!WARNING]
> This step require to use the same [Mailtrap account email 'MY_EMAIL in .env'] in shipping email when processing the order to avoid order failure, also make sure that you added your STRIPE_SECRET_KEY in the [Environment Variable](#environment-variables)
> Check courseEnrollmentController.js [paymentSuccess] for more info

6. Course Reviews:
   Each student can only make one review for each course

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[node-js]: https://svgur.com/i/19bZ.svg
[express-js]: https://svgur.com/i/19a1.svg
[mongo-db]: https://svgur.com/i/19b4.svg
[jwt]: https://svgshare.com/i/19bi.svg
