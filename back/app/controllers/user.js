const db = require("../models");
const rateLimit = require("express-rate-limit");
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const htmlspecialchars = require("../middleware/htmlspecialchars.js");
const userdecodedTokenId = require("../middleware/userDecodedTokenId.js");
const regex = require("../middleware/regex.js");

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
    roles: 0,
    image: null,
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
          token: jwt.sign({ userId: user.idUsers }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }),
        });
      });
    });
};
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
exports.getAllUsers = (req, res) => {
  const idUsers = req.query.idUsers;
  let condition = idUsers ? { idUsers: { [Op.like]: `%${idUsers}%` } } : null;

  db.user
    .findAll({
      where: condition,
      attributes: ["idUsers", "names", "firstnames", "image"],
    })
    .then((userAll) => {
      res.status(200).send({ userAll });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération des idUsers",
      });
    });
};
/* exports.deleteUser = (req, res) => {
  const id = req.params.id;
  db.publication
    .findAll({
      where: {
        usersId: user.idUsers,
      },
    })
    .then((publications) => {
      publications.forEach((publication) => {
        db.comment
          .findAll({
            where: { publicationsId: publication.idPublications },
          })
          .then((comments) =>
            comments.forEach((comment) => {
              comment
                .destroy()
                .then(() => {
                  res.status(200).send({ message: "Commentaires supprimés" });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Une erreur s'est produite lors de la suppression des commentaires",
                  });
                });
            })
          )
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Aucun commentaires trouvées",
            });
          });
        db.user_disliked
          .findAll({
            where: {
              publicationsId: publication.idPublications,
            },
          })
          .then((dislikes) => {
            dislikes.forEach((dislike) => {
              dislike
                .destroy()
                .then(() => {
                  res.status(200).send({ message: "dislikes supprimés" });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Une erreur s'est produite lors de la suppression des dislikes",
                  });
                });
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Aucun like trouvé",
            });
          });
        db.user_liked
          .findAll({
            where: {
              publicationsId: publication.idPublications,
            },
          })
          .then((likes) => {
            likes.forEach((like) => {
              like
                .destroy()
                .then(() => {
                  res.status(200).send({ message: "likes supprimés" });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Une erreur s'est produite lors de la suppression des likes",
                  });
                });
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Aucun like trouvé",
            });
          });
        publication
          .destroy()
          .then(() => {
            res.status(200).send({ message: "publication supprimé" });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Une erreur s'est produite lors de la suppression de la publication",
            });
          });
      });
    });
};
 */

exports.updateUser = (req, res) => {
  //ValidatRegex
  if (!namesAndFirstnameRegex.test(req.body.names)) {
    return res.status(400).send({ message: "Le nom est invalide" });
  }
  if (!namesAndFirstnameRegex.test(req.body.firstnames)) {
    return res.status(400).send({ message: "Le prénom est invalide" });
  }
  if (!emailRegex.test(req.body.emails)) {
    return res.status(400).send({ message: "L'email est invalide" });
  }
  if (!passwordRegex.test(req.body.passwords)) {
    return res.status(400).send({ message: "Le mot de passe est invalide" });
  }
  const password = htmlspecialchars(req.body.passwords);
  // Create an User
  const user = {
    names: htmlspecialchars(req.body.names),
    firstnames: htmlspecialchars(req.body.firstnames),
    emails: htmlspecialchars(req.body.emails),
    passwords: bcrypt.hashSync(password, 10),
    roles: User.role,
    image: null,
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
  const id = req.params.id;
  User.update(
    {
      names: user.names,
      firstnames: user.firstnames,
      emails: user.emails,
      passwords: user.passwords,
    },
    { where: { idUsers: id } }
  )
    .then((num) => {
      if (num == 1) {
        res.status(200).send({ message: "User a bien été modifié" });
      } else {
        res.status(400).send({ message: "User non trouvé !" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Impossible de modifier l'User :" + id,
      });
    });
};
exports.limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2,
});
