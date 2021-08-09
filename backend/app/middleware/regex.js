"use strict";

const regex = {
  emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  namesAndFirstnameRegex: /^[a-zA-Z]+[^&><"'=/!£$]+(([-][a-zA-Z ])?[a-zA-Z]*)*$/,
};

module.exports = regex;
