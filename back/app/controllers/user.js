//Way to model
const db = require("../models");
const rateLimit = require("express-rate-limit");
const Op = db.Sequelize.Op;
//Protect
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const config = require("../config/auth.config.js");
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");
const htmlspecialchars = require("../middleware/htmlspecialchars.js");
const passwordValidator = require("password-validator");
const regex = require("../middleware/regex.js");
/*
 * ********* Function : Schema of passwordValidator *********
 */
//Create a schema
const schema = new passwordValidator();
//Add properties to it
schema
  // Minimum length 8
  .is()
  .min(8)
  // Maximum length 100
  .is()
  .max(100)
  // Must have uppercase letters
  .has()
  .uppercase()
  // Must have lowercase letters
  .has()
  .lowercase()
  // Must have at least 1 digits
  .has()
  .digits(1)
  // Should not have spaces
  .has()
  .not()
  .spaces()
  //Not regex
  .not(/[&><"'=/!£$]/);
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
  if (!schema.validate(req.body.passwords)) {
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
        message: err.message,
      });
    });
};
/*
 * ********* Function : login User *********
 */
exports.login = (req, res) => {
  const password = String(htmlspecialchars(req.body.passwords));
  const email = String(htmlspecialchars(req.body.emails));
  db.user
    .findOne({
      where: {
        emails: email,
      },
    })
    .then((user) => {
      bcrypt.compare(password, user.passwords).then((valid) => {
        if (!valid) {
          return res
            .status(401)
            .send({ message: "Mot de passe ou emails non trouvés " });
        } else {
          res.status(200).send({
            userId: user.idUsers,
            token: jwt.sign({ userId: user.idUsers }, config.secret, {
              expiresIn: "24h",
            }),
          });
        }
      });
    })
    .catch(() => {
      res.status(401).send({
        message: "Mot de passe ou emails non trouvés ",
      });
    });
};
/*
 * ********* Function : GetOne User *********
 */
exports.getOneUser = (req, res) => {
  const id = req.params.id;
  db.user
    .findOne({
      where: { idUsers: userDecodedTokenId(req) },
    })
    .then(() => {
      db.user
        .findOne({
          where: { idUsers: id },
          attributes: ["idUsers", "emails", "names", "firstnames", "image"],
        })
        .then((user) => {
          if (!user) {
            return res.status(404).send({
              message:
                "Une erreur s'est produite lors de la récupération de User avec l'id :" +
                id,
            });
          } else {
            return res.status(200).send(user);
          }
        });
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
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
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
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
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
/*
 * ********* Function : update Image User *********
 */
exports.updateUserImage = (req, res) => {
  db.user
    .findOne({
      where: { idUsers: userDecodedTokenId(req) },
    })
    .then((user) => {
      if (user.image != "http://localhost:3000/images/avatarDefault.jpg") {
        const filename = user.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            return console.log(err);
          } else {
            console.log("image supprimée !");
          }
        });
      }
      user
        .update({
          image: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        })
        .then(() => {
          res.status(201).send({ message: " image créée !" });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
/*
 * ********* Function : Delete User *********
 */
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      if (user.idUsers === id || user.role == 1) {
        db.comment.destroy({ where: { usersId: id } }).then(() => {
          db.user_liked.destroy({ where: { usersId: id } }).then(() => {
            db.user_disliked.destroy({ where: { usersId: id } }).then(() => {
              db.publication
                .findOne({ where: { usersId: id } })
                .then((publication) => {
                  db.comment
                    .destroy({
                      where: { publicationsId: publication.idPublications },
                    })
                    .then(() => {
                      db.user_liked
                        .destroy({
                          where: {
                            publicationsId: publication.idPublications,
                          },
                        })
                        .then(() => {
                          db.user_disliked
                            .destroy({
                              where: {
                                publicationsId: publication.idPublications,
                              },
                            })
                            .then(() => {
                              const filename = publication.imagesUrl.split(
                                "/images/"
                              )[1];
                              fs.unlink(`images/${filename}`, (err) => {
                                if (err) {
                                  return console.log(err);
                                } else {
                                  console.log("image supprimée !");
                                }
                              });
                              publication.destroy().then(() => {
                                db.user
                                  .destroy({ where: { idUsers: id } })
                                  .then(() => {
                                    res
                                      .status(200)
                                      .send({ message: "User supprimé !" });
                                  })
                                  .catch((err) => {
                                    res.status(500).send({
                                      message: err.message,
                                    });
                                  });
                              });
                            });
                        });
                    });
                });
            });
          });
        });
      } else {
        return res.status(403).send({ message: "Condition non respectée " });
      }
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
/*
 * ********* Function : Limit request number *********
 */
exports.limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
});
