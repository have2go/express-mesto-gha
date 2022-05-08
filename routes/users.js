const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUser,
  getAllUsers,
  getMyUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

users.get('/users/me', getMyUser);

users.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

users.get('/users', getAllUsers);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

users.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Заполните поле корректным URL');
      })
      .message({
        'string.required': 'Поле должны быть заполнено',
      }),
  }),
}), updateUserAvatar);

module.exports = users;
