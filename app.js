const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/404-notfound');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, usersRoute);
app.use('/', auth, cardsRoute);

app.all('*', () => {
  throw new NotFoundError('Ошибка 404. Страница не найдена');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
