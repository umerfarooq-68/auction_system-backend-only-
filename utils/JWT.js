const jwt = require('jsonwebtoken');
require('dotenv').config()
function generateResetToken(user) {
  const secret = process.env.SERCRET;
  return jwt.sign({ id: user.id }, secret, { expiresIn: '24h' });
}

module.exports = generateResetToken;