"use strict";

const Joi = require("joi");
const schemaPostModify = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = schemaPostModify;
