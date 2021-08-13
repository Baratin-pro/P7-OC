"use strict";

const Joi = require("joi");
const schemaCommentModify = Joi.object({
  id: Joi.number().required(),
  content: Joi.string().required(),
});

module.exports = schemaCommentModify;
