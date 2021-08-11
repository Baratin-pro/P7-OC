"use strict";

//Way to model
const db = require("../models");
//Protect
const fs = require("fs");
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");
const validator = require("validator");
const schemaPostCreate = require("../schema/schemaPostCreate.js");

exports.createPublication = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const userFound = await db.user.findOne({ where: { id: userId } });
    if (!userFound) {
      res.status(401).send({
        message: err.message || "Utilisateur non trouvé ",
      });
    } else {
      const publication = {
        title: String(req.body.title),
        description: String(req.body.description),
        imageUrl: String(
          `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        ),
        publicationDate: new Date(),
        userId: userFound.id,
      };
      const isValid = await schemaPostCreate.validateAsync(publication);
      if (!isValid) {
        return res.status(400).send({ message: "Erreur des données envoyées" });
      } else {
        db.publication
          .create(publication)
          .then(() => {
            res.status(201).send({ message: "Publication créée avec succes" });
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message,
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

exports.getOnePublication = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user.userId);
    const user = await db.user.findOne({ where: { id: userId } });
    if (!user) {
      res
        .status(401)
        .send({ message: err.message || "Utilisateur non trouvé " });
    } else {
      db.publication
        .findOne({
          where: { id: id },
          include: [
            {
              model: db.comment,
              as: "comment",
              attributes: { exclude: ["userId"] },
              include: {
                model: db.user,
                as: "user",
                attributes: ["lastname", "firstname", "image"],
              },
            },
            {
              model: db.user,
              as: "user",
              attributes: ["lastname", "firstname", "image", "id"],
            },
          ],
        })
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
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * ********* Function : Get All Publication *********
 *
 *
 *  -- Description : Permet l'affichage de toute les publications
 */
exports.getAllPublication = (req, res) => {
  let publicationsDate = req.query.publicationsDate;

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
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

    .then((publication) => {
      res.status(200).send(publication);
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

/**
 * ********* Function : Update Publication *********
 *
 *  -- Description : Permet la modification de la publication
 *
 * @params : new FormData();
 * @params : data.append("title", "Voyage de Gulivert");
 * @params : data.append("description", "Luluputin");
 * @params : data.append("image", fileInput.files[0], "/path/to/file");
 *
 *  -- Resultat exemple :
 *
 * {
 *  "title" : "Voyage de Gulivert",
 *  "description" : "Luluputin",
 *  "image" : " http://localhost:3000/images/44908592981609749963981.jpg ",
 *  ...
 * }
 *
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

  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
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
          return publication.update({
            titles: publicationReq.title,
            descriptions: publicationReq.description,
            imagesUrl: publicationReq.imagesUrl,
          });
        }
      }
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
      res.status(404).send({
        message: err.message || "Publication non trouvé",
      });
    });
};
/**
 * ********* Function : Delete Publication *********
 *
 * -- Description : Permet la suppression de la publication
 *
 * @params : req.params.id
 *
 * -- Resultat exemple :
 *
 *  Publication supprimée
 *
 */
exports.deleteOnePublication = (req, res) => {
  const id = req.params.id;

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

    .then((publicationFind) => {
      publication = publicationFind;
      if (publication.usersId === user.idUsers || user.role == 1) {
        n;
        return db.comment.destroy({ where: { publicationsId: id } });
      } else {
        throw res.status(403).send({ message: "Condition non respectée " });
      }
    })

    .then(() => {
      return db.user_liked.destroy({ where: { publicationsId: id } });
    })

    .then(() => {
      return db.user_disliked.destroy({ where: { publicationsId: id } });
    })

    .then(() => {
      const filename = publication.imagesUrl.split("/images/")[1];
      fs.unlink(`app/images/${filename}`, (err) => {
        if (err) {
          return console.log(err);
        } else {
          console.log("image supprimée !");
        }
      });
      return publication.destroy({ where: { idPublications: id } });
    })

    .then(() => {
      res.status(200).send({ message: "Publication supprimée !" });
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
