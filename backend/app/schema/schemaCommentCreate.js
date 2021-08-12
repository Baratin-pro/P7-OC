"use strict";

const Joi = require("joi");
const schemaCommentCreate = Joi.object({
  comment: Joi.string().required(),
  publicationId: Joi.number().required(),
  userId: Joi.number().required(),
});

module.exports = schemaCommentCreate;
