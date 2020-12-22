"use strict";

//Way to model
const db = require("../models");
const Op = db.Sequelize.Op;
//Protect
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");
let user;
let publication;
let countDisliked;
let countLiked;
/*
 * ********* Function : Create Liked *********
 */
exports.addLiked = (req, res) => {
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
      // Find and count all likes of publication
      return db.user_disliked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_dislikedFindAndCountAll) => {
      countDisliked = user_dislikedFindAndCountAll;
      // Find and count all dislikes of publication
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
    })
    .catch(() => {
      res.status(403).send({ message: "Déja présent" });
    });
};
/*
 * ********* Function : Delete Liked *********
 */
exports.deleteLiked = (req, res) => {
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
        return db.publication.findOne({ where: { idPublications: id } });
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
    // destroy liked if present
    .then((liked) => {
      liked.destroy();
    })
    // Find and count all likes of publication
    .then(() => {
      return db.user_liked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })
    .then((userlLikedFindAndCountAll) => {
      countLiked = userlLikedFindAndCountAll;
      // Modify publication in the database
      return publication.update({
        likes: countLiked.count,
      });
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({ message: "Liked supprimé" });
    })
    .catch(() => {
      res.status(404).send({
        message: "liked non trouvé ",
      });
    });
};
/*
 * ********* Function : Create Disliked *********
 */
exports.addDisliked = (req, res) => {
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
      }
      // Find publication of request
      return db.publication.findOne({
        where: { idPublications: id },
      });
    })
    .then((publicationFind) => {
      publication = publicationFind;
      if (!publication) {
        res.status(404).send({
          message: "Publication : " + id + " non trouvé ",
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
      // destroy liked if present
      if (liked) {
        liked.destroy();
      }
      // Find and count all likes of publication
      return db.user_liked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((user_dislikedFindAndCountAll) => {
      countDisliked = user_dislikedFindAndCountAll;
      // Find and count all dislikes of publication
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
    })
    .catch(() => {
      res.status(403).send({ message: "Déja présent" });
    });
};

/*
 * ********* Function : Delete Disliked *********
 */
exports.deleteDisliked = (req, res) => {
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
        return db.publication.findOne({ where: { idPublications: id } });
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
    // destroy liked if present
    .then((disliked) => {
      disliked.destroy();
    })
    // Find and count all likes of publication
    .then(() => {
      return db.user_disliked.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })
    .then((userDislikedFindAndCountAll) => {
      countDisliked = userDislikedFindAndCountAll;
      // Modify publication in the database
      return publication.update({
        dislikes: countDisliked.count,
      });
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({ message: "Disliked supprimé" });
    })
    .catch(() => {
      res.status(404).send({
        message: "disliked non trouvé ",
      });
    });
};
