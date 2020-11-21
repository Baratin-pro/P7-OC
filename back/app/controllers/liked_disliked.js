//Way to model
const db = require("../models");
const Op = db.Sequelize.Op;
//Protect
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");

/*
 * ********* Function : Create Liked *********
 */
exports.addLiked = (req, res) => {
  const id = req.body.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      db.publication
        .findOne({
          where: { idPublications: id },
        })
        .then((publication) => {
          db.user_disliked
            .findOne({
              where: {
                usersId: user.idUsers,
                publicationsId: publication.idPublications,
              },
            })
            .then((disliked) => {
              if (disliked) {
                disliked.destroy();
              }
              db.user_liked
                .create({
                  usersId: user.idUsers,
                  publicationsId: publication.idPublications,
                })
                .then(() => {
                  res.status(201).send({ message: "Liked rajouté" });
                })
                .catch(() => {
                  res.status(403).send({
                    message: "Déja présent",
                  });
                });
            });
        })
        .catch(() => {
          res.status(404).send({
            message: "Publication : " + id + " non trouvé ",
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
 * ********* Function : Delete Liked *********
 */
exports.deleteLiked = (req, res) => {
  const id = req.body.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      db.publication
        .findOne({ where: { idPublications: id } })
        .then((publication) => {
          db.user_liked
            .findOne({
              where: {
                usersId: user.idUsers,
                publicationsId: publication.idPublications,
              },
            })
            .then((liked) => {
              liked.destroy().then(() => {
                res.status(201).send({ message: "liked supprimé" });
              });
            })
            .catch(() => {
              res.status(404).send({
                message: "liked non trouvé ",
              });
            });
        })
        .catch(() => {
          res.status(404).send({
            message: "Publication : " + id + " non trouvé ",
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
 * ********* Function : Create Disliked *********
 */
exports.addDisliked = (req, res) => {
  const id = req.body.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      db.publication
        .findOne({
          where: { idPublications: id },
        })
        .then((publication) => {
          db.user_liked
            .findOne({
              where: {
                usersId: user.idUsers,
                publicationsId: publication.idPublications,
              },
            })
            .then((liked) => {
              if (liked) {
                liked.destroy();
              }
              db.user_disliked
                .create({
                  usersId: user.idUsers,
                  publicationsId: publication.idPublications,
                })
                .then(() => {
                  res.status(201).send({ message: "Disliked rajouté" });
                })
                .catch(() => {
                  res.status(403).send({
                    message: "Déja présent",
                  });
                });
            });
        })
        .catch(() => {
          res.status(404).send({
            message: "Publication : " + id + " non trouvé ",
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
 * ********* Function : Delete Liked *********
 */
exports.deleteDisliked = (req, res) => {
  const id = req.body.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      db.publication
        .findOne({ where: { idPublications: id } })
        .then((publication) => {
          db.user_disliked
            .findOne({
              where: {
                usersId: user.idUsers,
                publicationsId: publication.idPublications,
              },
            })
            .then((disliked) => {
              disliked.destroy().then(() => {
                res.status(201).send({ message: "disliked supprimé" });
              });
            })
            .catch(() => {
              res.status(404).send({
                message: "disliked non trouvé ",
              });
            });
        })
        .catch(() => {
          res.status(404).send({
            message: "Publication : " + id + " non trouvé ",
          });
        });
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    });
};
