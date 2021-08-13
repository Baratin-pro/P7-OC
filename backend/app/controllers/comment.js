"use strict";

const db = require("../models");
const validator = require("validator");
const schemaCommentCreate = require("../schema/schemaCommentCreate.js");
const schemaCommentModify = require("../schema/schemaCommentModify.js");

exports.createComment = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const user = await db.user.findOne({ where: { id: userId } });
    let publication = null;
    if (!user) {
      res.status(401).send({
        message: "Utilisateur non trouvé ",
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
        message: "Utilisateur non trouvé ",
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
        message: "Utilisateur non trouvé ",
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

exports.updateComment = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const comment = {
      id: Number(req.params.id),
      content: String(validator.escape(req.body.comment)),
    };
    const isValid = await schemaCommentModify.validateAsync(comment);
    if (!isValid) {
      return res.status(400).send({ message: "Erreur des données envoyées" });
    } else {
      const user = await db.user.findOne({ where: { id: userId } });
      if (!user) {
        res.status(401).send({
          message: "Utilisateur non trouvé ",
        });
      } else {
        const commentFound = await db.comment.findOne({
          where: {
            userId: userId,
            id: comment.id,
          },
        });
        if (!commentFound) {
          return res.status(404).send({
            message:
              "Une erreur s'est produite lors de la récupération du commentaire avec l'id :" +
              comment.id,
          });
        } else {
          commentFound
            .update({
              comment: comment.content,
            })
            .then(() => {
              res
                .status(201)
                .send({ message: "Commentaire modifié avec succès" });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message,
              });
            });
        }
      }
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const idComment = Number(req.params.id);
    const user = await db.user.findOne({ where: { id: userId } });
    const comment = await db.comment.findOne({ where: { id: idComment } });
    if (!user) {
      res.status(401).send({
        message: "Utilisateur non trouvé ",
      });
    } else if (!comment) {
      res.status(400).send({
        message: "Commentaire non trouvé ",
      });
    } else {
      if (comment.userId === user.id || user.role === 1) {
        comment.destroy({ where: { id: idComment } });
        const publication = await db.publication.findOne({
          where: { id: comment.publicationId },
        });
        db.comment
          .findAndCountAll({ where: { publicationId: publication.id } })
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
      } else {
        return res.status(403).send({ message: "Condition non respectée " });
      }
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
