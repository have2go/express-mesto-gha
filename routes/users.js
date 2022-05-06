const users = require('express').Router();

const {
  getUser,
  getAllUsers,
  getMyUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

users.get('/users/me', getMyUser);
users.get('/users/:userId', getUser);
users.get('/users', getAllUsers);
users.patch('/users/me', updateUser);
users.patch('/users/me/avatar', updateUserAvatar);

module.exports = users;
