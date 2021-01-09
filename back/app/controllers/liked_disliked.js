"use strict";

//Way to model
const db = require("../models");
const Op = db.Sequelize.Op;
//Protect
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
let user;
let publication;
let countDisliked;
let countLiked;

/**
 * ********* Function : Create Liked *********
 *
 * -- Description : Permet la creation d'un like
 *
 * @params : req.body.id
 * @params : JSON.stringify({"id":"54"});
 *
 * -- Resultat exemple :
 *
 * Like ajouté ou like supprimé
 */

exports.liked = (req, res) => {
  const id = req.body.id;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((userFind) => {
      user = userFind;
      if (!user) {
        res
          .status(401)
          .send({ message: err.message || "Utilisateur non trouvé " });
      } else {
        return db.publication.findOne({
          where: { idPublications: id },
        });
      }
    })

    .then((publicationFind) => {
      publication = publicationFind;
      if (!publication) {
        res.status(404).send({
          message: "Publication : " + id + " non trouvé ",
        });
      } else {
        return db.user_liked.findOne({
          where: {
            usersId: user.idUsers,
            publicationsId: publication.idPublications,
          },
        });
      }
    })

    .then((userCheckPresence) => {
      if (userCheckPresence) {
        userCheckPresence.destroy();
        return db.user_liked
          .findAndCountAll({
            where: { publicationsId: publication.idPublications },
          })

          .then((user_likedFindAndCountAll) => {
            return publication.update({
              likes: user_likedFindAndCountAll.count,
            });
          })

          .then(() => {
            res.status(200).send({ message: "Liked supprimé " });
          });
      } else {
        return db.user_liked.create({
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        });
      }
    })

    .then(() => {
      return db.user_disliked.findOne({
        where: {
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        },
      });
    })

    .then((disliked) => {
      if (disliked) {
        disliked.destroy();
      }
      return db.user_disliked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_dislikedFindAndCountAll) => {
      countDisliked = user_dislikedFindAndCountAll;
      return db.user_liked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_likedFindAndCountAll) => {
      countLiked = user_likedFindAndCountAll;
      return publication.update({
        dislikes: countDisliked.count,
        likes: countLiked.count,
      });
    })

    .then(() => {
      res.status(201).send({ message: "Liked rajouté" });
    });
};
/**
 * ********* Function : Create DisLiked *********
 *
 * -- Description : Permet la creation d'un like
 *
 * @params : req.body.id
 * @params : JSON.stringify({"id":"54"});
 *
 * -- Resultat exemple :
 *
 * Dislike ajouté ou Dislike supprimé
 */

exports.disliked = (req, res) => {
  const id = req.body.id;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((userFind) => {
      user = userFind;
      if (!user) {
        res
          .status(401)
          .send({ message: err.message || "Utilisateur non trouvé " });
      } else {
        return db.publication.findOne({
          where: { idPublications: id },
        });
      }
    })

    .then((publicationFind) => {
      publication = publicationFind;
      if (!publication) {
        res.status(404).send({
          message: "Publication : " + id + " non trouvé ",
        });
      } else {
        return db.user_disliked.findOne({
          where: {
            usersId: user.idUsers,
            publicationsId: publication.idPublications,
          },
        });
      }
    })

    .then((userCheckPresence) => {
      if (userCheckPresence) {
        userCheckPresence.destroy();
        return db.user_disliked
          .findAndCountAll({
            where: { publicationsId: publication.idPublications },
          })

          .then((user_dislikedFindAndCountAll) => {
            return publication.update({
              dislikes: user_dislikedFindAndCountAll.count,
            });
          })

          .then(() => {
            res.status(200).send({ message: "Disliked supprimé " });
          });
      } else {
        return db.user_disliked.create({
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        });
      }
    })

    .then(() => {
      return db.user_liked.findOne({
        where: {
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        },
      });
    })

    .then((liked) => {
      if (liked) {
        liked.destroy();
      }
      return db.user_disliked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_dislikedFindAndCountAll) => {
      countDisliked = user_dislikedFindAndCountAll;
      return db.user_liked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_likedFindAndCountAll) => {
      countLiked = user_likedFindAndCountAll;
      return publication.update({
        dislikes: countDisliked.count,
        likes: countLiked.count,
      });
    })

    .then(() => {
      res.status(201).send({ message: "Disliked rajouté" });
    });
};
