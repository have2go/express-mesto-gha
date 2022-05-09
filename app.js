const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/404-notfound');
const { regex } = require('./utils/constants');
const errorHandler = require('./middlewares/error-handler');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), createUser);
app.use('/', auth, usersRoute);
app.use('/', auth, cardsRoute);

app.all('*', auth, () => {
  throw new NotFoundError('Ошибка 404. Страница не найдена');
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
