const bcrypt = require("bcrypt"); // protection password
const jwt = require("jsonwebtoken"); // protection token
const rateLimit = require("express-rate-limit"); // protection against abusive attacks
const User = require("../src/models/User.js");
const { validationResult } = require("express-validator");
/* ****************Function : signup*****************
 *
 * Adding a user to the database
 *
 */
module.exports = {
  signup: (req, res, next) => {
    //Params
    const name = req.body.names;
    const firstname = req.body.firstnames;
    const email = req.body.emails;
    const password = req.body.passwords;

    if (
      name == null ||
      firstname == null ||
      email == null ||
      password == null
    ) {
      return res.status(400).json({ error: "paramètre absent" });
    }

    //TODO verify length, mail regex, passwor ...
    User.findOne({ attributes: ["email"], where: { email: email } })
      .then(function (userFound) {
        if (!userFound) {
          bcrypt.hash(req.body.passwords, 10, function (err, bcryptedPassword) {
            const NewUser = User.create({
              names: name,
              firstnames: firstname,
              emails: email,
              passwords: bcryptedPassword,
            })
              .then(function (newUser) {
                return res.status(201).json({
                  usersId: newUser.id,
                });
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "impossible de rajouter l'utilisateur" });
              });
          });
        } else {
          return res.status(409).json({ error: "email déjà utiliser" });
        }
      })
      .catch(function (err) {
        return res
          .status(500)
          .json({ error: "impossible de vérifier l'utilisateur" });
      });
  },
};
