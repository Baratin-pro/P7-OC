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

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      const comment = {
        usersId: user.idUsers,
        comments: String(validator.escape(req.body.comments)),
        publicationsId: req.body.publicationsId,
      };
      if (!comment) {
        res.status(400).send({ message: "Commentaire absent !" });
      }
      db.comment
        .create(comment)
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
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
/*
 * ********* Function : Get One Comment *********
 */
exports.getComment = (req, res) => {
  const idComment = req.params.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then(() => {
      db.comment
        .findOne({
          where: {
            idComments: idComment,
            usersId: userDecodedTokenId(req),
          },
          attributes: ["comments", "idComments"],
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
            message: err,
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
 * ********* Function : Update Comment *********
 */
exports.updateComment = (req, res) => {
  if (!req.body.comments) {
    return res.status(400).send({ message: "Paramètre absent" });
  }
  const idComment = req.params.id;
  const commentReq = String(validator.escape(req.body.comments));
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then(() => {
      db.comment
        .findOne({
          where: {
            usersId: userDecodedTokenId(req),
            idComments: idComment,
          },
        })
        .then((comment) => {
          if (!comment) {
            return res.status(404).send({
              message:
                "Une erreur s'est produite lors de la récupération de la publication avec l'id :" +
                idComment,
            });
          } else {
            db.comment
              .update(
                {
                  comments: commentReq,
                },
                {
                  where: {
                    usersId: userDecodedTokenId(req),
                    idComments: idComment,
                  },
                }
              )
              .then(() => {
                res
                  .status(201)
                  .send({ message: "Commentaire modifié avec succès" });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err,
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
 * ********* Function : Delete Comment *********
 */
exports.deleteComment = (req, res) => {
  const idComment = req.params.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      db.comment
        .findOne({
          where: {
            idComments: idComment,
          },
        })
        .then((comment) => {
          if (comment.usersId === user.idUsers || user.role == 1) {
            comment
              .destroy({
                where: {
                  idComments: idComment,
                },
              })
              .then(() => {
                res.status(200).send({ message: "Commentaire supprimé !" });
              });
          } else {
            return res
              .status(403)
              .send({ message: "Condition non respectée " });
          }
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
