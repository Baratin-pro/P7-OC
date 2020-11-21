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
        usersId: user.idUsers,
      };
      db.publication.create(publication).then(() => {
        res.status(201).send({ message: "Publication créé avec succes" });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
/*
 * ********* Function : Get One Publication *********
 */
exports.getOnePublication = (req, res) => {
  const id = req.params.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then(() => {
      db.publication
        .findOne({
          where: { idPublications: id },
          include: [
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
          db.user_liked
            .findAndCountAll({ where: { publicationsId: id } })
            .then((countLike) => {
              db.user_disliked
                .findAndCountAll({ where: { publicationsId: id } })
                .then((countDislike) => {
                  db.comment
                    .findAndCountAll({ where: { publicationsId: id } })
                    .then((countComment) => {
                      publication
                        .update({
                          dislikes: countDislike.count,
                          likes: countLike.count,
                          commentCount: countComment.count,
                          where: { publicationsId: id },
                        })
                        .then((publicationFinal) => {
                          res.status(200).send(publicationFinal);
                        });
                    });
                });
            });
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
/*
 * ********* Function : Get All Publication *********
 */
exports.getAllPublication = (req, res) => {
  let publicationsId = req.query.publicationsId;
  let condition = publicationsId
    ? { publicationsId: { [Op.like]: `%${publicationsId}%` } }
    : null;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then(() => {
      db.publication
        .findAll({
          where: condition,
          include: [
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
        .then((publicationInitiale) => {
          publicationInitiale.forEach((element) => {
            db.user_liked
              .findAndCountAll({
                where: { publicationsId: element.idPublications },
              })
              .then((countLike) => {
                db.user_disliked
                  .findAndCountAll({
                    where: { publicationsId: element.idPublications },
                  })
                  .then((countDislike) => {
                    db.comment
                      .findAndCountAll({
                        where: { publicationsId: element.idPublications },
                      })
                      .then((countComment) => {
                        element.update({
                          dislikes: countDislike.count,
                          likes: countLike.count,
                          commentCount: countComment.count,
                          where: { idPublications: element.idPublications },
                        });
                      });
                  });
              });
          });
          res.status(200).send(publicationInitiale);
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
/*
 * ********* Function : Update Publication *********
 */
exports.updatePublication = (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).send({ message: "Paramètre absent" });
  }
  const publicationReq = {
    idPublication: req.params.id,
    title: String(validator.escape(req.body.title)),
    description: String(validator.escape(req.body.description)),
    image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  };
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then(() => {
      db.publication
        .findOne({
          where: { idPublications: publicationReq.idPublication },
        })
        .then((publication) => {
          const filename = publication.imagesUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("image supprimée !");
            }
            publication
              .update({
                titles: publicationReq.title,
                descriptions: publicationReq.description,
                imagesUrl: publicationReq.image,
              })
              .then(() => {
                res.status(201).send({
                  message:
                    "Publication : " +
                    publicationReq.idPublication +
                    " a été modifié avec succès",
                });
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message,
                });
              });
          });
        })
        .catch((err) => {
          res.status(404).send({
            message: err.message || "Publication non trouvé",
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
              .status(403)
              .send({ message: "Condition non respectée " });
          }
        });
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
