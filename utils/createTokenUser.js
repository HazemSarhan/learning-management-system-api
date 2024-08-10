const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    email: user.email,
    role: user.role,
    bio: user.bio,
    image: user.profilePicture,
  };
};

module.exports = createTokenUser;
