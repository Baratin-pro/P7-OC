const db = require("../models");
const Comment = db.comment;
const Op = db.Sequelize.Op;

exports.createComment = (req, res) => {
  const comment = req.body.comments;
  if (!comment) {
    res.status(400).send({ message: "Commentaire absent !" });
  }
  Comment.create(comment)
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
exports.updateComment = (req, res) => {};

exports.getComment = (req, res) => {};

exports.deleteComment = (req, res) => {};
