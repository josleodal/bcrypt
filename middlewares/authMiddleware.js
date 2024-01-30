const jwt = require('jsonwebtoken');
const { generateSecret } = require('../crypto/config.js');

// Obtener secreto
const hashedSecret = generateSecret();

// Función para generar un token JWT utilizando la información del usuario.
function generateToken(user) {
  return jwt.sign({ user: user.id }, hashedSecret, { expiresIn: '1h' });
}

// Middleware que verifica la validez del token almacenado en la sesión.
function verifyToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, hashedSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido', error: err.message });
    }

    req.user = decoded.user;
    next();
  });
}

module.exports = { generateToken, verifyToken };
