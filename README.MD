[Learning Management System API]

## API Documentation

For detailed API documentation, visit [API Documentation](http://localhost:5000/api-docs).

=======================================================================================================

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

=======================================================================================================

## Course Structure [Tags, Subcategory, Category]

NOTE: "Please create the structure in order!!!!!!" {1: tags, 2: subcategorires, 3: category}

- [1] => Tags
  = Create a new Tag => {name}
  NOTE: In the raw & form-data you can add subcategories by both (name & id) choose whatever you like!
  NOTE: You can send multiple tags in the same request
  Check the documentation for more info!

- [2] => Subcategory
  = Create a new Subcategory => {name, description, tags}
  NOTE: In the raw & form-data you can add tags by both (name & id) choose whatever you like!
  NOTE: You can send multiple subcategories in the same request
  Check the documentation for more info!

- [3] => Category
  = Create a new catagory
  NOTE: In the raw & form-data you can add (subcategories & tags) by both (name & id) choose whatever you like!
  NOTE: You can only create one category

After creating [Tags, Subcategory, Category] in order, you can create a new tag and add the created subcategory.
Also you can create a new category directly with the created data without re-create (category, tag) from scratch.
Please, check the documentation for more info!

## Course Structure [Tags, Subcategory, Category] Routes:

[Next Step]

=======================================================================================================

## Course Management [Course, Sections, Lectures]:

[Next Step]

## Course Management [Course, Sections, Lectures] Routes:

[Next Step]

=======================================================================================================

## Course Assignments [Quizzes, Answers] :

[Next Step]

## Course Assignments [Quizzes, Answers] Routes:

[Next Step]

=======================================================================================================

## Course Enrollments [Enrollment([Free, Paid with payment]), Transaction] :

[Next Step]

## Course Enrollments [Enrollment([Free, Paid with payment]), Transaction] Routes:

[Next Step]

=======================================================================================================

# License

This project is licensed under the MIT License.
