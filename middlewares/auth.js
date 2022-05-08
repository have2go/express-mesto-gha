const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/401-unauth');

const JWT_SECRET = 'secret-key';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Вы не авторизованы');
  }

  req.user = payload;
  next();
};
