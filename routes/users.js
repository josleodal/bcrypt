const express = require('express');
const router = express.Router();
const { generateToken, verifyToken } = require('../middlewares/authMiddleware.js');
const { comparePasswords } = require('../crypto/config.js');

const users = [
  { id: 1, username: 'usuario1', password: 'contraseña1', name: 'Usuario Uno' },
  { id: 2, username: 'usuario2', password: 'contraseña2', name: 'Usuario Dos' },
];

// Ruta de inicio
router.get('/', (req, res) => {
  const loginForm = `
    <form action="/login" method="post">
      <label for="username">Usuario:</label>
      <input type="text" id="username" name="username" required><br>

      <label for="password">Contraseña:</label>
      <input type="password" id="password" name="password" required><br>

      <button type="submit">Iniciar sesión</button>
    </form>
    <a href="/dashboard">dashboard</a>
  `;
  res.send(loginForm);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

 

  if (user) {
    const passwordMatch = user.password === password;
   

    if (passwordMatch) {
      const token = generateToken(user);
     

      req.session.token = token;


      return res.redirect('/dashboard');
    }
  }

  console.log('Autenticación Fallada');
  return res.status(401).json({ message: 'Credenciales incorrectas' });
});



// Ruta del panel de control

router.get('/dashboard', verifyToken, (req, res) => {
  console.log(req.user);
  const userId = req.user;
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.send(`
      <h1>Bienvenido, ${user.name}!</h1>
      <p>ID: ${user.id}</p>
      <p>Usuario: ${user.username}</p>
      <br>
      <form action="/logout" method="post">
        <button type="submit">Cerrar sesión</button>
      </form>
      <a href="/">home</a>
    `);
  } else {
    res.status(401).json({ message: 'Usuario no encontrado' });
  }
});

// Ruta de cierre de sesión
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
