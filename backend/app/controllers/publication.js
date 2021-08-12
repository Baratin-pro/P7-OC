"use strict";

//Way to model
const db = require("../models");
//Protect
const fs = require("fs");
const userDecodedTokenId = require("../middleware/userDecodedTokenId.js");
const validator = require("validator");
const schemaPostCreate = require("../schema/schemaPostCreate.js");
const schemaPostModify = require("../schema/schemaPostModify.js");

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

exports.getAllPublication = async (req, res) => {
  try {
    const publicationDate = req.query.publicationDate;
    const userId = Number(req.user.userId);
    const user = await db.user.findOne({ where: { id: userId } });
    if (!user) {
      res
        .status(401)
        .send({ message: err.message || "Utilisateur non trouvé " });
    } else {
      db.publication
        .findAll({
          where: publicationDate,
          order: [["publicationDate", "DESC"]],
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
              attributes: ["lastname", "firstname", "image"],
            },
          ],
        })

        .then((publication) => {
          res.status(200).send(publication);
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

exports.updatePublication = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const user = await db.user.findOne({ where: { id: userId } });
    if (!user) {
      res
        .status(401)
        .send({ message: err.message || "Utilisateur non trouvé " });
    } else {
      const publication = {
        id: Number(req.params.id),
        title: String(validator.escape(req.body.title)),
        description: String(validator.escape(req.body.description)),
      };
      const isValid = await schemaPostModify.validateAsync(publication);
      if (!isValid) {
        return res.status(400).send({ message: "Erreur des données envoyées" });
      } else {
        if (req.file) {
          publication.imageUrl = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
        }
        db.publication
          .findOne({ where: { id: publication.id } })
          .then((publicationFound) => {
            if (!publicationFound) {
              return res.status(404).send({
                message:
                  "Une erreur s'est produite lors de la récupération de User avec l'id :" +
                  publication.id,
              });
            } else {
              if (publication.imageUrl) {
                const filename = publicationFound.imageUrl.split("/images/")[1];
                fs.unlink(`app/images/${filename}`, (err) => {
                  if (err) {
                    return console.log(err);
                  } else {
                    console.log("image supprimée !");
                  }
                });
              }
              return publicationFound.update({ ...publication });
            }
          })
          .then(() => {
            res.status(201).send({
              message: "La publication a été modifié avec succès",
            });
          })
          .catch((err) => {
            res.status(404).send({
              message: err.message || "Publication non trouvé",
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

exports.deleteOnePublication = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const id = Number(req.params.id);
    const user = await db.user.findOne({ where: { id: userId } });
    const publication = await db.publication.findOne({ where: { id: id } });

    if (!user) {
      res
        .status(401)
        .send({ message: err.message || "Utilisateur non trouvé " });
    }
    if (!publication) {
      res
        .status(401)
        .send({ message: err.message || "Publication non trouvé " });
    }
    if (publication.userId === user.id || user.role == 1) {
      db.comment
        .destroy({ where: { publicationId: id } })
        .then(() => {
          return db.user_liked.destroy({ where: { publicationId: id } });
        })
        .then(() => {
          return db.user_disliked.destroy({ where: { publicationId: id } });
        })
        .then(() => {
          const filename = publication.imageUrl.split("/images/")[1];
          fs.unlink(`app/images/${filename}`, (err) => {
            return err ? console.log(err) : console.log("image supprimée !");
          });
          return publication.destroy({ where: { id: id } });
        })
        .then(() => {
          res.status(200).send({ message: "Publication supprimée !" });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    } else {
      return res.status(403).send({ message: "Condition non respectée " });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
