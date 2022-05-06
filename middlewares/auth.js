const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret-key';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    // В таком виде jwt.verify() работает синхронно,
    // поэтому все остальное я также поместил в блок try.
    // Иначе после .send({ message: 'Вы не авторизованы' })
    // сервер также пытается отправить ошибку из
    // catch контроллера и крашится
    req.user = payload;
    next();
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Вы не авторизованы' });
  }
};
