const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(
      (err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(500).send({ message: err.message });
        }
      },
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.user._id)
    .orFail(new Error('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // передеть обновленный объект в then
  )
    .orFail(new Error('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.user._id,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // передеть обновленный объект в then
  )
    .orFail(new Error('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
