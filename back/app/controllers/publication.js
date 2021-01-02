"use strict";

//Way to model
const db = require("../models");
const Op = db.Sequelize.Op;
//Protect
const fs = require("fs");
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");
const validator = require("validator");

let user;
let publication;
/*
 * ********* Function : Create Publication *********
 */
exports.createPublication = (req, res) => {
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
      const image = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
      const publication = {
        titles: String(req.body.titles),
        descriptions: String(req.body.descriptions),
        imagesUrl: image,
        publicationsDate: new Date(),
        usersId: user.idUsers,
      };
      // Create new publication
      return db.publication.create(publication);
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({ message: "Publication créé avec succes" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
/*
 * ********* Function : Get One Publication *********
 */
exports.getOnePublication = (req, res) => {
  const id = req.params.id;
  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      // Find publication in the database
      return db.publication.findOne({
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
            attributes: ["names", "firstnames", "image", "idUsers"],
          },
        ],
      });
    })
    // Return responses of server
    .then((publication) => {
      if (!publication) {
        return res.status(404).send({
          message:
            "Une erreur s'est produite lors de la récupération de User avec l'id :" +
            id,
        });
      } else {
        return res.status(200).send(publication);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
/*
 * ********* Function : Get All Publication *********
 */
exports.getAllPublication = (req, res) => {
  let publicationsDate = req.query.publicationsDate;

  // Find user in the database
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })
    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
      // Find all publication in the database
      return db.publication.findAll({
        where: publicationsDate,
        order: [["publicationsDate", "DESC"]],
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
      });
    })
    // Return responses of server
    .then((publication) => {
      res.status(200).send(publication);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
/*
 * ********* Function : Update Publication *********
 */
exports.updatePublication = (req, res) => {
  if (req.body.titles === null || req.body.descriptions === null) {
    return res
      .status(400)
      .send({ message: err.message || " Paramètres manquants" });
  }
  let image;
  if (req.file) {
    image = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  const publicationReq = {
    idPublication: req.params.id,
    title: String(validator.escape(req.body.titles)),
    description: String(validator.escape(req.body.descriptions)),
    imagesUrl: image,
  };
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
      return db.publication.findOne({
        where: { idPublications: publicationReq.idPublication },
      });
    })
    .then((publication) => {
      if (!publication) {
        return res.status(404).send({
          message:
            "Une erreur s'est produite lors de la récupération de User avec l'id :" +
            publicationReq.idPublication,
        });
        // Delete image if present
      } else {
        if (publicationReq.imagesUrl == null) {
          return publication.update({
            titles: publicationReq.title,
            descriptions: publicationReq.description,
          });
        } else {
          const filename = publication.imagesUrl.split("/images/")[1];
          fs.unlink(`app/images/${filename}`, (err) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("image supprimée !");
            }
          });
          // Modify publication in the database
          return publication.update({
            titles: publicationReq.title,
            descriptions: publicationReq.description,
            imagesUrl: publicationReq.imagesUrl,
          });
        }
      }
    })
    // Return responses of server
    .then(() => {
      res.status(201).send({
        message:
          "Publication : " +
          publicationReq.idPublication +
          " a été modifié avec succès",
      });
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || "Publication non trouvé",
      });
    });
};
/*
 * ********* Function : Delete Publication *********
 */
exports.deleteOnePublication = (req, res) => {
  const id = req.params.id;
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
      return db.publication.findOne({
        where: { idPublications: id },
      });
    })
    // Find publication in the database
    .then((publicationFind) => {
      publication = publicationFind;
      // Check identity user
      if (publication.usersId === user.idUsers || user.role == 1) {
        // Destroy comments of the publication
        return db.comment.destroy({ where: { publicationsId: id } });
      } else {
        return res.status(403).send({ message: "Condition non respectée " });
      }
    })
    .then(() => {
      // Destroy liked of the publications
      return db.user_liked.destroy({ where: { publicationsId: id } });
    })

    .then(() => {
      // Destroy disliked of the publication
      return db.user_disliked.destroy({ where: { publicationsId: id } });
    })

    .then(() => {
      // Destroy image of the publication
      const filename = publication.imagesUrl.split("/images/")[1];
      fs.unlink(`app/images/${filename}`, (err) => {
        if (err) {
          return console.log(err);
        } else {
          console.log("image supprimée !");
        }
      });
      // Destroy publication in the database
      return publication.destroy({ where: { idPublications: id } });
    })
    // Return responses of server
    .then(() => {
      res.status(200).send({ message: "Publication supprimée !" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
