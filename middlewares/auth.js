const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/401-unauth');

const JWT_SECRET = 'secret-key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Вы не авторизованы');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Вы не авторизованы');
  }

  req.user = payload;
  next();
};
