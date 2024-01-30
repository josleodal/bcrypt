const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Generar secreto aleatorio
const generateSecret = () => {
  const secret = crypto.randomBytes(64).toString('hex');
  return bcrypt.hashSync(secret, 10);
};

module.exports = {
  generateSecret,
};
