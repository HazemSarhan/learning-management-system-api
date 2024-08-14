[Learning Management System API]

# API Documentation

For detailed API documentation, visit [API Documentation](http://localhost:5000/api-docs).

# User Schema

- name: str, email: str, password: str, role: str, bio: str, profilePicture: str, {timestamps}
- email: => unique // mongoose validator {isValidate} // controller function
- password: hashing password with [bcrypt-js] && compare it with plain text password
- role: first registered user is admin, default role is student
- profilePicture: upload images to cloud service (cloudinary)

# Authentication Routes

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `POST /api/v1/auth/logout` - Logout a user

# User Structure && Routes

- getAllUsers => Only for admins to get all users data
- showMe => To show current logged in user data
- getSingleUser => To get a single user info with userId
- updateUser => To update user data {name, email, bio, profilePicture}
- updateUserPassword => To update user password

- `GET /api/v1/users/` - Get all users data
- `Get /api/v1/users/showMe` - Showing authenticated user data
- `PATCH /api/v1/users/updateUser` - Update user data {name, email, bio, profilePicture}
- `POST /api/v1/users/updateUserPassword` - Update user password
- `POST /api/v1/users/:id` - Get single user data by {userId}

# Course Structure Workflow [UPDATED]

> [!NOTE]
> Previous workflow was to make the structure in order : [Tags, Subcategory, Category]
> Check the previous commit for comparision and changes

> [!IMPORTANT]
> Check the documentation for more info.

1- Tags:

- In the raw & form-data you can add subcategories by both (name & id) choose whatever you like!
- You can send multiple tags in the same request

2- Subcategory:

- In the raw & form-data you can add tags by both (name & id) choose whatever you like!
- You can send multiple subcategories in the same request

3- Category:

- In the raw & form-data you can add (subcategories & tags) by both (name & id) choose whatever you like!

  > [!WARNING]
  > You can create ONLY ONE CATEGORY PER REQUEST!

# Course Structure [Tags, Subcategory, Category] Routes:

- `POST /api/v1/course/structure/tag` - Create a new tag or multiple tags
- `GET /api/v1/course/structure/tag` - Get all tags
- `GET /api/v1/course/structure/tag/{tagId}` - Get single tags
- `PATCH /api/v1/course/structure/tag/{tagId}` - Update Tag
- `DELETE /api/v1/course/structure/tag/{tagId}` - Delete Tag

- `POST /api/v1/course/structure/subcategory` - Create a new subcategory or multiple subcategories
- `GET /api/v1/course/structure/subcategory` - Get all subcategories
- `GET /api/v1/course/structure/subcategory/{subcategoryId}` - Get single Subcategory
- `PATCH /api/v1/course/structure/subcategory/{subcategoryId}` - Update Subcategory
- `DELETE /api/v1/course/structure/subcategory/{subcategoryId}` - Delete Subcategory

- `POST /api/v1/course/structure/category` - Create a new category [only one is allowed]
- `GET /api/v1/course/structure/category` - Get all Categories
- `GET /api/v1/course/structure/category/{categoryId}` - Get single Categories
- `PATCH /api/v1/course/structure/category/{categoryId}` - Update Category
- `DELETE /api/v1/course/structure/category/{categoryId}` - Delete Category

# Course Management [Course, Sections, Lectures]:

- Models Created!
  [Next Step]

# Course Management [Course, Sections, Lectures] Routes:

[Next Step]

# Course Assignments [Quizzes, Answers] :

[Next Step]

# Course Assignments [Quizzes, Answers] Routes:

[Next Step]

# Course Enrollments [Enrollment([Free, Paid with payment]), Transaction] :

[Next Step]

# Course Enrollments [Enrollment([Free, Paid with payment]), Transaction] Routes:

[Next Step]

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
