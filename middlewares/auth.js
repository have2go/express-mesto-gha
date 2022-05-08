const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret-key';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Вы не авторизованы' });
  }

  req.user = payload;
  next();
};
