[Learning Management System API]

## API Documentation

For detailed API documentation, visit [API Documentation](http://localhost:5000/api-docs).

## User Schema

- [x] name: str, email: str, password: str, role: str, bio: str, profilePicture: str, {timestamps}
- [x] email: => unique // mongoose validator {isValidate} // controller function
- [x] password: hashing password with [bcrypt-js] && compare it with plain text password
- [x] role: first registered user is admin, default role is student
- [x] profilePicture: upload images to cloud service (cloudinary)

## Authentication Routes

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `POST /api/v1/auth/logout` - Logout a user

## User Structure && Routes

- (getAllUsers[admin], showMe, getSingleUser[admin], updateUser, updateUserPassword)
- [x] getAllUsers => Only for admins to get all users data
- [x] showMe => To show current logged in user data
- [x] getSingleUser => To get a single user info with userId
- [x] updateUser => To update user data {name, email, bio, profilePicture}
- [x] updateUserPassword => To update user password

- `GET /api/v1/users/` - Get all users data
- `Get /api/v1/users/showMe` - Showing authenticated user data
- `PATCH /api/v1/users/updateUser` Update user data {name, email, bio, profilePicture}
- `POST /api/v1/users/updateUserPassword` Update user password
- `POST /api/v1/users/:id` - Get single user data by {userId}

## Course Structure [Tags, Subcategory, Category]

'''
Previous workflow was to make the structure in order : [Tags, Subcategory, Category]
Check the previous commit for comparision and changes
'''

Course Structure Workflow [UPDATED]

# [x] => Tags:

- You can send multiple tags in the same request
- In the raw & form-data you can add subcategories by both (name & id) choose whatever you like!
  NOTE: Check the documentation for more info!

# [x] => Subcategory:

- In the raw & form-data you can add tags by both (name & id) choose whatever you like!
- You can send multiple subcategories in the same request
  NOTE: Check the documentation for more info!

# [x] => Category:

- In the raw & form-data you can add (subcategories & tags) by both (name & id) choose whatever you like!
  NOTE: You can create ONLY ONE CATEGORY PER REQUEST
  NOTE: Check the documentation for more info!

## Course Structure [Tags, Subcategory, Category] Routes:

- `POST /api/v1/course/structure/tags` - Create a new tag or multiple tags
- `GET /api/v1/course/structure/tags` - Get all tags
- `POST /api/v1/course/structure/subcategory` - Create a new subcategory or multiple subcategories
- `GET /api/v1/course/structure/subcategory` - Get all subcategories
- `POST /api/v1/course/structure/category` - Create a new category [only one is allowed]
- `GET /api/v1/course/structure/tags` - Get all categories
  [EDIT/UPDATE/DELETE] IN FUTURE.

## Course Management [Course, Sections, Lectures]:

- Models Created!
  [Next Step]

## Course Management [Course, Sections, Lectures] Routes:

[Next Step]

## Course Assignments [Quizzes, Answers] :

[Next Step]

## Course Assignments [Quizzes, Answers] Routes:

[Next Step]

## Course Enrollments [Enrollment([Free, Paid with payment]), Transaction] :

[Next Step]

## Course Enrollments [Enrollment([Free, Paid with payment]), Transaction] Routes:

[Next Step]

# License

This project is licensed under the MIT License.
