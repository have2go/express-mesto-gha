const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getAllCards);

cards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Заполните поле валидным URL');
      })
      .message({
        'string.required': 'Поле должны быть заполнено',
      }),
  }),
}), createCard);

cards.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

cards.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

cards.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = cards;
