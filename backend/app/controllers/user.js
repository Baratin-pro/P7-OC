"use strict";

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
const schemaSignup = require("../schema/schemaSignup.js");
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
  .max(32)
  // Must have uppercase letters
  .has()
  .uppercase()
  // Must have lowercase letters
  .has()
  .lowercase()
  // Must have at least 1 digits
  .has()
  .digits()
  // Should not have spaces
  .has()
  .not()
  .spaces()
  //Not regex
  .not(/[&><"'=/!£$]/);

exports.signup = async (req, res) => {
  try {
    const password = String(
      bcrypt.hashSync(htmlspecialchars(req.body.password), 10)
    );
    const user = {
      lastname: String(req.body.name),
      firstname: String(req.body.firstname),
      email: String(req.body.email),
      password: password,
    };
    const isvalid = await schemaSignup.validateAsync(user);
    if (!isvalid) {
      return res.status(400).send({ message: "Erreur des données envoyée" });
    } else {
      if (user.lastname.length >= 40 || user.lastname.length <= 1) {
        throw res
          .status(400)
          .send({ message: "Le nom doit comprendre entre 2 et 40 lettres" });
      }

      if (user.firstname.length >= 40 || user.firstname.length <= 1) {
        throw res
          .status(400)
          .send({ message: "Le prénom doit comprendre entre 2 et 40 lettres" });
      }
      const userFound = await db.user.findOne({ where: { email: user.email } });
      if (userFound) {
        return res
          .status(403)
          .send({ message: "Cette adresse mail est déjà utilisée" });
      } else {
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
      }
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
/** 
 * ********* Function : login User *********
 * 
 *  -- Description : Permet la connection d'un utilisateur
 * 
 * @params : req.body.emails : exemple@groupomaina.fr
 * @params : req.body.passwords : mot de passe
 * 
 * -- Resultat exemple :
 * {
    "userId": 180,
    "admin": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4MCwiaWF0IjoxNjA5OTYwMjIwLCJleHAiOjE2MTAwNDY2MjB9.cA_KcgoUL9oNA3WRL1FrXiCH3M6_Ly3mtxAsUhFv0eg"
}
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
            admin: user.role,
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
/**
 * ********* Function : GetOne User *********
 *
 * -- Description : Permet l'affichage de l'utilisateur du token
 *
 * -- Resultat exemple :
 *
 * {
 *   "idUsers": 180,
 *   "emails": "louis@14.fr",
 *   "names": "Versaille",
 *   "firstnames": "Louis",
 *   "image": "http://localhost:3000/images/44908592981609749963981.jpg"
 * }
 *
 */
exports.getOneUser = (req, res) => {
  db.user
    .findOne({
      where: { idUsers: userDecodedTokenId(req) },
      attributes: ["idUsers", "emails", "names", "firstnames", "image"],
    })

    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Une erreur s'est produite lors de la récupération de User ",
        });
      } else {
        return res.status(200).send(user);
      }
    })

    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
/**
 * ********* Function : GetAll User *********
 *
 *  -- Description : Permet l'affichage de tous les utilisateurs
 *
 */
exports.getAllUsers = (req, res) => {
  const allUsers = req.query.idUsers;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      return db.user.findAll({
        where: allUsers,
        attributes: ["idUsers", "names", "firstnames", "image", "emails"],
      });
    })

    .then((usersFindAll) => {
      res.status(200).send(usersFindAll);
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

/** 
 * ********* Function : update Image User *********
 * 
 *-- Description : Permet la modification de l'image de l'utilisateur du token

 * @params : new FormData(); 
 * @params : data.append("image", fileInput.files[0], "/path/to/file");
 * 
 * -- Resultat exemple :
 * 
 * {
 *  "image": "http://localhost:3000/images/44908592981609749963981.jpg",
 * }
 *  
 */
exports.updateUserImage = (req, res) => {
  db.user
    .findOne({
      where: { idUsers: userDecodedTokenId(req) },
    })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      if (user.image != "http://localhost:3000/images/avatarDefault.jpg") {
        const filename = user.image.split("/images/")[1];
        fs.unlink(`app/images/${filename}`, (err) => {
          if (err) {
            return console.log(err);
          } else {
            console.log("image supprimée !");
          }
        });
      }
      return user.update({
        image: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });
    })

    .then(() => {
      res.status(201).send({ message: " image créée !" });
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
/**
 * ********* Function : Delete User *********
 *
 * -- Description : Permet la suppression de l'utilisateur cible, qu'ainsi ses commentaires, ses like, ses dislike, ses publications
 *
 * @params : req.params.id
 *
 * -- Resultat exemple :
 *
 * Utilisateur supprimé
 */
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  let publication;
  let user;
  let userAuth;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((userFindAuth) => {
      userAuth = userFindAuth;

      if (userAuth.idUsers == id || userAuth.role == 1) {
        return db.user.findOne({ where: { idUsers: id } });
      } else {
        throw res.status(403).send({ message: "Condition non respectée " });
      }
    })

    .then((userFind) => {
      user = userFind;

      return db.comment.destroy({ where: { usersId: id } });
    })

    .then(() => {
      return db.user_liked.destroy({ where: { usersId: id } });
    })

    .then(() => {
      return db.user_disliked.destroy({ where: { usersId: id } });
    })

    .then(() => {
      return db.publication.findAll({ where: { usersId: id } });
    })

    .then((publicationFind) => {
      publication = publicationFind;
      if (!publication) {
        if (user.idUsers != id) {
          res.status(404).send({ message: "User non trouvé !" });
        }
        if (user.image != "http://localhost:3000/images/avatarDefault.jpg") {
          const filename = user.image.split("/images/")[1];
          fs.unlink(`app/images/${filename}`, (err) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("image supprimée !");
            }
          });
        }

        db.user.destroy({ where: { idUsers: id } });
        return res.status(200).send({ message: "User supprimé !" });
      }
    })

    .then(() => {
      for (let i = 0; i < publication.length; i++) {
        if (publication[i].imagesUrl) {
          console.log(publication[i].imagesUrl);
          const filename = publication[i].imagesUrl.split("/images/")[1];
          fs.unlink(`app/images/${filename}`, (err) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("image supprimée !");
            }
          });
        }

        db.comment.destroy({
          where: { publicationsId: publication[i].idPublications },
        });

        db.user_liked.destroy({
          where: { publicationsId: publication[i].idPublications },
        });

        db.user_disliked.destroy({
          where: { publicationsId: publication[i].idPublications },
        });
      }
      return db.publication.destroy({ where: { usersId: id } });
    })

    .then(() => {
      if (user.image != "http://localhost:3000/images/avatarDefault.jpg") {
        const filename = user.image.split("/images/")[1];
        fs.unlink(`app/images/${filename}`, (err) => {
          if (err) {
            return console.log(err);
          } else {
            console.log("image supprimée !");
          }
        });
      }
      return db.user.destroy({ where: { idUsers: id } });
    })

    .then((userDestroy) => {
      if (!userDestroy) {
        return res.status(404).send({ message: "User id:" + id });
      } else {
        return res.status(200).send({ message: "User supprimé !" });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
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
