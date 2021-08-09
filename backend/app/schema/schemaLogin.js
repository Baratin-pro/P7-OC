"use strict";

const Joi = require("joi");

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "fr"] } })
    .max(128)
    .required(),
  password: Joi.string().min(8).required(),
});

module.exports = schemaLogin;
