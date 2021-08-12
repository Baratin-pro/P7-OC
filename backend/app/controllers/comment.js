"use strict";

const db = require("../models");
const validator = require("validator");
const schemaCommentCreate = require("../schema/schemaCommentCreate.js");

exports.createComment = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const user = await db.user.findOne({ where: { id: userId } });
    let publication = null;
    if (!user) {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    } else {
      const comment = {
        userId: Number(user.id),
        comment: String(req.body.comment),
        publicationId: Number(req.body.id),
      };
      const isValid = await schemaCommentCreate.validateAsync(comment);
      if (!isValid) {
        return res.status(400).send({ message: "Erreur des données envoyées" });
      } else {
        db.comment
          .create(comment)
          .then((createComment) => {
            return db.publication.findOne({
              where: { id: createComment.publicationId },
            });
          })
          .then((publicationFind) => {
            publication = publicationFind;
            return db.comment.findAndCountAll({
              where: { publicationId: publication.id },
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
      }
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

exports.getComment = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const idComment = Number(req.params.id);
    const user = await db.user.findOne({ where: { id: userId } });
    if (!user) {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    } else {
      db.comment
        .findOne({
          where: {
            id: idComment,
            userId: userId,
          },
          attributes: ["comment", "id"],
        })
        .then((comment) => {
          if (!comment) {
            return res.status(404).send({
              message:
                "Une erreur s'est produit lors de la récupération du commentaire avec l'id :" +
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
              "Une erreur s'est produit lors de la récupération du commentaire",
          });
        });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

exports.getAllCommentsPublication = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const idPublication = Number(req.params.id);
    const user = await db.user.findOne({ where: { id: userId } });
    if (!user) {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    } else {
      db.comment
        .findAll({
          where: { publicationId: idPublication },
          include: [
            {
              model: db.user,
              as: "user",
              attributes: ["lastname", "firstname", "image"],
            },
          ],
        })
        .then((comments) => {
          if (comments.length <= 0) {
            return res.status(404).send({
              message:
                "Une erreur s'est produite lors de la récupération des commentaires de la publication avec l'id :" +
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
              "Une erreur s'est produit lors de la récupération des commentaires de la publications",
          });
        });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
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
