const regex = {
  emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passwordRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
  namesAndFirstnameRegex: /^[a-zA-Z]+[^&><"'=/!£$]+(([-][a-zA-Z ])?[a-zA-Z]*)*$/,
};

module.exports = regex;
