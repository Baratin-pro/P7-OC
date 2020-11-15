//Way to model
const db = require("../models");
const rateLimit = require("express-rate-limit");
const Op = db.Sequelize.Op;
//Protect
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const config = require("../config/auth.config.js");
const userdecodedTokenId = require("../middleware/userDecodedTokenId.js");
const htmlspecialchars = require("../middleware/htmlspecialchars.js");
const regex = require("../middleware/regex.js");
/*
 * ********* Function : create User *********
 */
exports.signup = (req, res) => {
  //ValidatRegex
  if (!regex.namesAndFirstnameRegex.test(req.body.names)) {
    return res.status(400).send({ message: "Le nom est invalide" });
  }
  if (!regex.namesAndFirstnameRegex.test(req.body.firstnames)) {
    return res.status(400).send({ message: "Le prénom est invalide" });
  }
  if (!regex.emailRegex.test(req.body.emails)) {
    return res.status(400).send({ message: "L'email est invalide" });
  }
  if (!regex.passwordRegex.test(req.body.passwords)) {
    return res.status(400).send({ message: "Le mot de passe est invalide" });
  }
  const password = htmlspecialchars(req.body.passwords);
  // Create an User
  const user = {
    names: String(htmlspecialchars(req.body.names)),
    firstnames: String(htmlspecialchars(req.body.firstnames)),
    emails: String(htmlspecialchars(req.body.emails)),
    passwords: String(bcrypt.hashSync(password, 10)),
  };
  // Validaterequest
  if (
    user.names == null ||
    user.firstnames == null ||
    user.emails == null ||
    password == null
  ) {
    res.status(400).send({ message: "Paramètre absent!" });
    return;
  }
  //ValidatLength
  if (user.names.length >= 40 || user.names.length <= 1) {
    return res
      .status(400)
      .send({ message: "Le nom doit comprendre entre 2 et 40 lettres" });
  }
  if (user.firstnames.length >= 40 || user.firstnames.length <= 1) {
    return res
      .status(400)
      .send({ message: "Le prénom doit comprendre entre 2 et 40 lettres" });
  }
  //Save User in the database
  db.user
    .create(user)
    .then(() => {
      res.status(201).send({ message: "Utilisateur créé avec succes" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de user",
      });
    });
};
/*
 * ********* Function : login User *********
 */
exports.login = (req, res) => {
  const password = String(req.body.passwords);
  const email = String(req.body.emails);
  db.user
    .findOne({
      where: {
        emails: email,
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Utilisateur non trouvé " });
      }
      bcrypt.compare(password, user.passwords).then((valid) => {
        if (!valid) {
          return res.status(401).send({ message: "Mot de passe incorrecte" });
        } else {
        }
        res.status(200).send({
          userId: user.idUsers,
          token: jwt.sign({ userId: user.idUsers }, config.secret, {
            expiresIn: "24h",
          }),
        });
      });
    });
};
/*
 * ********* Function : GetOne User *********
 */
exports.compte = (req, res) => {
  db.user
    .findOne({
      where: { idUsers: userdecodedTokenId(req) },
      attributes: ["idUsers", "emails", "names", "firstnames", "image"],
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération de User avec l'id:" +
            id,
      });
    });
};
/*
 * ********* Function : GetAll User *********
 */
exports.getAllUsers = (req, res) => {
  const idUsers = req.query.idUsers;
  let condition = idUsers ? { idUsers: { [Op.like]: `%${idUsers}%` } } : null;
  db.user
    .findOne({ where: { idUsers: userdecodedTokenId(req) } })
    .then(() => {
      db.user
        .findAll({
          where: condition,
          attributes: ["idUsers", "names", "firstnames", "image"],
        })
        .then((userAll) => {
          res.status(200).send(userAll);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Une erreur s'est produite lors de la récupération des idUsers",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération de User avec l'id:" +
            id,
      });
    });
};

exports.updateUserImage = (req, res) => {
  const image = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  /*  db.user
    .findOne({ where: { idUsers: userdecodedTokenId(req) } })
    .then(() => { */
  db.user
    .update(
      { images: image },
      {
        where: {
          idUsers: userdecodedTokenId(req),
        },
      }
    )
    .then(() => {
      res.status(201).send({ message: " image créée !" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de l'image ",
      });
    });
};
/* ).catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération de User avec l'id:" +
            id,
      });
    }); 
};*/

/*
 * ********* Function : Limit request number *********
 */
exports.limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
});
