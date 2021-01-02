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
/*
 * ********* Function : Create Liked *********
 */
exports.liked = (req, res) => {
  const id = req.body.id;

  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((userFind) => {
      user = userFind;
      if (!user) {
        res
          .status(401)
          .send({ message: err.message || "Utilisateur non trouvé " });
      } else {
        // Find publication of request
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
        // Find user of request in the table user_liked
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
        // Find and count all likes of publication
        return db.user_liked
          .findAndCountAll({
            where: { publicationsId: publication.idPublications },
          })

          .then((user_likedFindAndCountAll) => {
            // Modify publication in the database
            return publication.update({
              likes: user_likedFindAndCountAll.count,
            });
          })
          .then(() => {
            res.status(200).send({ message: "Liked supprimé " });
          });
      } else {
        // Create new liked
        return db.user_liked.create({
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        });
      }
    })
    .then(() => {
      // Find user of request in the table user_disliked
      return db.user_disliked.findOne({
        where: {
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        },
      });
    })
    .then((disliked) => {
      // destroy disliked if present
      if (disliked) {
        disliked.destroy();
      }
      // Find and count all dislikes of publication
      return db.user_disliked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_dislikedFindAndCountAll) => {
      countDisliked = user_dislikedFindAndCountAll;
      // Find and count all likes of publication
      return db.user_liked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })
    .then((user_likedFindAndCountAll) => {
      countLiked = user_likedFindAndCountAll;
      // Modify publication in the database
      return publication.update({
        dislikes: countDisliked.count,
        likes: countLiked.count,
      });
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({ message: "Liked rajouté" });
    });
};
/*
 * ********* Function : Create Disliked *********
 */
exports.disliked = (req, res) => {
  const id = req.body.id;

  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((userFind) => {
      user = userFind;
      if (!user) {
        res
          .status(401)
          .send({ message: err.message || "Utilisateur non trouvé " });
      } else {
        // Find publication of request
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
        // Find user of request in the table user_disliked
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
        // Find and count all dislikes of publication
        return db.user_disliked
          .findAndCountAll({
            where: { publicationsId: publication.idPublications },
          })

          .then((user_dislikedFindAndCountAll) => {
            // Modify publication in the database
            return publication.update({
              dislikes: user_dislikedFindAndCountAll.count,
            });
          })
          .then(() => {
            res.status(200).send({ message: "Disliked supprimé " });
          });
      } else {
        // Create new disliked
        return db.user_disliked.create({
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        });
      }
    })
    .then(() => {
      // Find user of request in the table user_liked
      return db.user_liked.findOne({
        where: {
          usersId: user.idUsers,
          publicationsId: publication.idPublications,
        },
      });
    })
    .then((liked) => {
      // destroy disliked if present
      if (liked) {
        liked.destroy();
      }
      // Find and count all dislikes of publication
      return db.user_disliked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_dislikedFindAndCountAll) => {
      countDisliked = user_dislikedFindAndCountAll;
      // Find and count all likes of publication
      return db.user_liked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })
    .then((user_likedFindAndCountAll) => {
      countLiked = user_likedFindAndCountAll;
      // Modify publication in the database
      return publication.update({
        dislikes: countDisliked.count,
        likes: countLiked.count,
      });
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({ message: "Disliked rajouté" });
    });
};
