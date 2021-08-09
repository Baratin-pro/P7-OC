"use strict";

function generateToken(n) {
  let alphabet =
    "0123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN";
  let token = "";
  for (let i = 0; i < n; i++) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return token;
}

module.exports = {
  secret:
    generateToken(40) +
    String(Date.now()) +
    generateToken(130) +
    String(Date.now()) +
    generateToken(40),
};
