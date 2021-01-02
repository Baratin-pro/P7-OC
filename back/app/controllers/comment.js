"use strict";

//Way to model
const db = require("../models");
const Op = db.Sequelize.Op;
//Protect
const validator = require("validator");
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");

/*
 * ********* Function : Create Comment *********
 */
exports.createComment = (req, res) => {
  if (!req.body.comments) {
    return res.status(400).send({ message: "Paramètre absent" });
  }
  let publication;
  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      // Recovery request
      const newComment = {
        usersId: user.idUsers,
        comments: String(req.body.comments),
        publicationsId: req.body.publicationsId,
      };
      if (!newComment) {
        res.status(400).send({ message: "Commentaire absent !" });
      }
      return newComment;
    })
    // Create new comment
    .then((newComment) => {
      return db.comment.create(newComment);
    })
    // Find publication of comment
    .then((createComment) => {
      return db.publication.findOne({
        where: { idPublications: createComment.publicationsId },
      });
    })
    // Find and count all comments of publication
    .then((publicationFind) => {
      publication = publicationFind;
      return db.comment.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })
    .then((countCommment) => {
      return publication.update({ commentCount: countCommment.count });
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({ message: "Commentaire créé avec succes" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produit lors de la création du commentaire",
      });
    });
};
/*
 * ********* Function : Get One Comment *********
 */
exports.getComment = (req, res) => {
  // Recovery request
  const idComment = req.params.id;
  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      // Find comment in the database
      return db.comment.findOne({
        where: {
          idComments: idComment,
          usersId: userDecodedTokenId(req),
        },
        attributes: ["comments", "idComments"],
      });
    })
    // Return responses of server
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({
          message:
            "Une erreur s'est produite lors de la récupération de la publication avec l'id :" +
            idComment,
        });
      } else {
        return res.status(200).send(comment);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produit lors de la création du commentaire",
      });
    });
};
/*
 * ********* Function : Get all Comments Publication *********
 */
exports.getAllCommentsPublication = (req, res) => {
  const idPublication = req.params.id;
  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      //Find Comment of the publication in the database
      else {
        return db.comment.findAll({
          where: { publicationsId: idPublication },
          include: [
            {
              model: db.user,
              as: "user",
              attributes: ["names", "firstnames", "image"],
            },
          ],
        });
      }
    })
    // Return responses of server
    .then((comments) => {
      if (!comments) {
        return res.status(404).send({
          message:
            "Une erreur s'est produite lors de la récupération de la publication avec l'id :" +
            idPublication,
        });
      } else {
        return res.status(200).send(comments);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produit lors de la création du commentaire",
      });
    });
};
/*
 * ********* Function : Update Comment *********
 */
exports.updateComment = (req, res) => {
  if (!req.body.comments) {
    return res.status(400).send({ message: "Paramètre absent" });
  }
  const idComment = req.params.id;
  const commentReq = String(validator.escape(req.body.comments));
  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    // Find comment in the database
    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      return db.comment.findOne({
        where: {
          usersId: userDecodedTokenId(req),
          idComments: idComment,
        },
      });
    })
    // Modify comment in the database
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({
          message:
            "Une erreur s'est produite lors de la récupération de la publication avec l'id :" +
            idComment,
        });
      } else {
        db.comment.update(
          {
            comments: commentReq,
          },
          {
            where: {
              usersId: userDecodedTokenId(req),
              idComments: idComment,
            },
          }
        );
      }
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({ message: "Commentaire modifié avec succès" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
/*
 * ********* Function : Delete Comment *********
 */
exports.deleteComment = (req, res) => {
  const idComment = req.params.id;
  let user;
  let comment;
  let publication;

  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((userFind) => {
      user = userFind;
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      // Find comment in the database
      return db.comment.findOne({
        where: { idComments: idComment },
      });
    })
    .then((commentFind) => {
      comment = commentFind;
      // Check identity user
      if (comment.usersId === user.idUsers || user.role == 1) {
        // Destroy comment in the database
        comment.destroy({ where: { idComments: idComment } });
        // Find publication in the database
        return db.publication.findOne({
          where: { idPublications: comment.publicationsId },
        });
      } else {
        return res.status(403).send({ message: "Condition non respectée " });
      }
    })
    .then((publicationFind) => {
      publication = publicationFind;
      // Find and count all comments of publication
      return db.comment.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })
    .then((countCommment) => {
      // Modify comment in the database
      return publication.update({ commentCount: countCommment.count });
    })
    // Return responses of server
    .then(() => {
      res.status(200).send({ message: "Commentaire supprimé !" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
