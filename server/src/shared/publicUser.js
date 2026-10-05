// Strips secrets from a user record before it leaves the API.
const publicUser = (user) => {
    if (!user) return user;
    const { password, verificationToken, tokenExpiresAt, ...rest } = user;
    return rest;
};

module.exports = publicUser;
