//Way to model
const db = require("../models");
const Op = db.Sequelize.Op;
//Protect
const fs = require("fs");
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");
const validator = require("validator");
/*
 * ********* Function : Create Publication *********
 */
exports.createPublication = (req, res) => {
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      const image = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
      const publication = {
        titles: String(validator.escape(req.body.titles)),
        descriptions: String(validator.escape(req.body.descriptions)),
        imagesUrl: image,
        publicationsDate: new Date(),
        likes: 0,
        dislikes: 0,
        usersId: user.idUsers,
      };

      db.publication
        .create(publication)
        .then(() => {
          res.status(201).send({ message: "Publication créé avec succes" });
        })
        .catch((err) => {
          res.status(400).send({
            message:
              err.message ||
              "Une erreur s'est produit lors de la création de la Publication",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produit lors de l'identification de l'utilisateur",
      });
    });
};
/*
 * ********* Function : Get One Publication *********
 */
exports.getOnePublication = (req, res) => {
  const id = req.params.id;
  let userLike = db.user_liked;
  db.publication
    .findOne({
      where: { idPublications: id },
      include: [
        {
          model: userLike,
          as: "publication_liked",
          attributes: [],
        },
        {
          model: db.user_disliked,
          as: "publication_disliked",
          attributes: [],
        },
        {
          model: db.comment,
          as: "comment",
          attributes: { exclude: ["usersId"] },
          include: {
            model: db.user,
            as: "user",
            attributes: ["names", "firstnames", "image"],
          },
        },
        {
          model: db.user,
          as: "user",
          attributes: ["names", "firstnames", "image"],
        },
      ],
    })
    .then((publication) => {
      res.status(200).send(publication);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération de Publication avec l'id:" +
            id,
      });
    });
};
/*
 * ********* Function : Get All Publication *********
 */
exports.getAllPublication = (req, res) => {
  const id = req.params.id;
  let userLike = db.user_liked;
  db.publication
    .findAll({
      include: [
        {
          model: userLike,
          as: "publication_liked",
          attributes: [],
        },
        {
          model: db.user_disliked,
          as: "publication_disliked",
          attributes: [],
        },
        {
          model: db.comment,
          as: "comment",
          attributes: { exclude: ["usersId"] },
          include: {
            model: db.user,
            as: "user",
            attributes: ["names", "firstnames", "image"],
          },
        },
        {
          model: db.user,
          as: "user",
          attributes: ["names", "firstnames", "image"],
        },
      ],
    })
    .then((publication) => {
      res.status(200).send(publication);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération des publications",
      });
    });
};
/*
 * ********* Function : Delete Publication *********
 */
exports.deleteOnePublication = (req, res) => {
  const id = req.params.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      db.publication
        .findOne({
          where: { idPublications: id },
        })
        .then((publication) => {
          if (publication.usersId === user.idUsers || user.role == 1) {
            db.comment.destroy({ where: { publicationsId: id } }).then(() => {
              db.user_liked
                .destroy({ where: { publicationsId: id } })
                .then(() => {
                  db.user_disliked
                    .destroy({ where: { publicationsId: id } })
                    .then(() => {
                      publication
                        .destroy({ where: { idPublications: id } })
                        .then(() => {
                          res
                            .status(200)
                            .send({ message: "Publication supprimée !" });
                        });
                    });
                });
            });
          } else {
            return res
              .status(401)
              .send({ message: "Condition non respectée " });
          }
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produit lors de l'identification de l'utilisateur",
      });
    });
};

/* 
 * ********* Function : Count All Comment *********
 
exports.CountComment = (req, res) => {
  const idComment = req.params.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then(() => {
      db.comment
        .findAndCountAll({
          where: {
            publicationsId: idComment,
          },
        })
        .then((pub) => {
          res.status(200).send({ alpha_roméo: pub.count });
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
}; */
