const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(
      (err) => {
        res.status(400).send({ message: err.message });
      },
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValid'))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new Error('NotValid'))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new Error('NotValid'))
    .then((user) => res.send({
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
    });
};
