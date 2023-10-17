const jwt = require('jsonwebtoken');
const cookieOptions = require('./cookieOptions');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  res.cookie('jwt', token, cookieOptions);
};

module.exports = generateToken;