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

###

# License

This project is licensed under the MIT License.
