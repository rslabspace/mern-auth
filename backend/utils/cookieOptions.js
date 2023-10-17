const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000
};

module.exports = cookieOptions