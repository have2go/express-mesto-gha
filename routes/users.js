const users = require('express').Router();

const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

users.post('/users', createUser);
users.get('/users/:userId', getUser);
users.get('/users', getAllUsers);
users.patch('/users/me', updateUser);
users.patch('/users/me/avatar', updateUserAvatar);

module.exports = users;
