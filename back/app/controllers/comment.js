"use strict";

//Way to model
const db = require("../models");
const Op = db.Sequelize.Op;
//Protect
const validator = require("validator");
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");

/**
 * ********* Function : Create Comment *********
 *
 * -- Description : Permet la creation d'un commentaire
 *
 * @params : req.body.comments
 * @params : req.body.publicationsId
 * @params : JSON.stringify({"comments":"Ceci est un commentaire ","publicationsId":"76"});
 *
 * -- Resultat exemple :
 *
 * "comments" :"Ceci est un commentaire";
 * "publicationsId" : "54";
 */

exports.createComment = (req, res) => {
  let publication;

  if (!req.body.comments) {
    return res.status(400).send({ message: "Paramètre absent" });
  }

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
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

    .then((newComment) => {
      return db.comment.create(newComment);
    })

    .then((createComment) => {
      return db.publication.findOne({
        where: { idPublications: createComment.publicationsId },
      });
    })

    .then((publicationFind) => {
      publication = publicationFind;
      return db.comment.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((countCommment) => {
      return publication.update({ commentCount: countCommment.count });
    })

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

/**
 * ********* Function : Get One Comment *********
 *
 * -- Description : Permet la récupération d'un commentaire
 *
 * @params : req.params.id
 *
 * -- Resultat exemple :
 *
 * "comments" : "Ceci est un commentaire"
 * "idComments" : 12
 *
 */

exports.getComment = (req, res) => {
  const idComment = req.params.id;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      return db.comment.findOne({
        where: {
          idComments: idComment,
          usersId: userDecodedTokenId(req),
        },
        attributes: ["comments", "idComments"],
      });
    })

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

/**
 * ********* Function : Get all Comments Publication *********
 *
 * -- Description : Permet la récupération des commentaires de la publication cible
 *
 * @params : req.params.id
 *
 * -- Resultat exemple :
 *
 * {
 *       "idComments": 238,
 *       "comments": "Ceci est un commentaire",
 *       "publicationsId": 76,
 *       "usersId": 180,
 *       "user": {
 *           "names": "Versaille",
 *           "firstnames": "Louis",
 *           "image": "http://localhost:3000/images/44908592981609749963981.jpg"
 *       }
 *   }
 */

exports.getAllCommentsPublication = (req, res) => {
  const idPublication = req.params.id;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      } else {
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

/**
 * ********* Function : Update Comment *********
 *
 * -- Description : Permet la modification d'un commentaire
 *
 * @params : req.params.id
 * @params : req.body.comments
 * @params : JSON.stringify({"comments":"Ceci est un commentaire "});
 *
 * -- Resultat exemple :
 *
 * "comments" :"Ceci est un commentaire";
 */

exports.updateComment = (req, res) => {
  const idComment = req.params.id;
  const commentReq = String(validator.escape(req.body.comments));

  if (!req.body.comments) {
    return res.status(400).send({ message: "Paramètre absent" });
  }

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

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

    .then(() => {
      res.status(201).send({ message: "Commentaire modifié avec succès" });
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
/**
 * ********* Function : Delete Comment *********
 *
 * -- Description : Permet la suppression d'un commentaire
 *
 * @params : req.params.id
 *
 * -- Resultat exemple :
 *
 *  Commentaire supprimé
 */
exports.deleteComment = (req, res) => {
  const idComment = req.params.id;
  let user;
  let comment;
  let publication;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((userFind) => {
      user = userFind;
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }

      return db.comment.findOne({
        where: { idComments: idComment },
      });
    })

    .then((commentFind) => {
      comment = commentFind;
      if (comment.usersId === user.idUsers || user.role == 1) {
        comment.destroy({ where: { idComments: idComment } });
        return db.publication.findOne({
          where: { idPublications: comment.publicationsId },
        });
      } else {
        throw res.status(403).send({ message: "Condition non respectée " });
      }
    })
    .then((publicationFind) => {
      publication = publicationFind;
      return db.comment.findAndCountAll({
        where: { publicationsId: publication.idPublications },
      });
    })

    .then((countCommment) => {
      return publication.update({ commentCount: countCommment.count });
    })

    .then(() => {
      res.status(200).send({ message: "Commentaire supprimé !" });
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
