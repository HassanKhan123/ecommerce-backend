const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, 'mysecret', { expiresIn: '10s' });
};

module.exports = {
  generateToken,
};
