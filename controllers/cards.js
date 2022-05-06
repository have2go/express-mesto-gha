const Card = require('../models/card');
const BadRequestError = require('../errors/400-bad-req');
const UnauthorizedError = require('../errors/401-unauth');
const NotFoundError = require('../errors/404-notfound');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length >= 1) {
        res.send(cards);
      } else {
        throw new NotFoundError('Карточки не найдены');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (userId !== card.owner.toString()) {
        throw new UnauthorizedError('Вы не можете удалять чужие карточки');
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then((cardToDelete) => {
          res.send({
            name: cardToDelete.name,
            link: cardToDelete.link,
            owner: cardToDelete.owner,
            likes: cardToDelete.likes,
            _id: cardToDelete._id,
            createdAt: cardToDelete.createdAt,
          });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // передеть обновленный объект в then
  )
    .then((card) => {
      if (card) {
        res.send({
          name: card.name,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          _id: card._id,
          createdAt: card.createdAt,
        });
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // передеть обновленный объект в then
  )
    .then((card) => {
      if (card) {
        res.send({
          name: card.name,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          _id: card._id,
          createdAt: card.createdAt,
        });
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка'));
      }
      next(err);
    });
};
