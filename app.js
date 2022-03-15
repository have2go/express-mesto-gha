const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '622f8df951e4723e26c99ec4',
  };

  next();
});

app.use('/', usersRoute);
app.use('/', cardsRoute);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
