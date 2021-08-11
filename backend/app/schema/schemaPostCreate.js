"use strict";

const Joi = require("joi");
const schemaPostCreate = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().required(),
  publicationDate: Joi.any().required(),
  userId: Joi.number().required(),
});

module.exports = schemaPostCreate;
