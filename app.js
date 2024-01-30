const express = require('express');
const session = require('express-session');
const usersRoutes = require('./routes/users.js');

const app = express();

app.use(session({
  secret: 'tu-secreto',
  resave: true,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', usersRoutes);

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
