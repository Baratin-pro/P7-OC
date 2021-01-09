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

/**
 * ********* Function : Create Publication *********
 *
 * -- Description : Permet la creation d'une publication
 *
 * @params : new FormData();
 * @params : data.append("titles", "titre de la publication");
 * @params : data.append("descriptions", "description de celle-ci");
 * @params : data.append("image", fileInput.files[0], "/C:/xxx/xxx/xxx/img/21326360.jpg");
 *
 * -- Resultat exemple :
 *
 * Publication créée
 *
 */

exports.createPublication = (req, res) => {
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
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
      return db.publication.create(publication);
    })

    .then(() => {
      res.status(201).send({ message: "Publication créé avec succes" });
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

/**
 * ********* Function : Get One Publication *********
 *
 *
 * -- Description : Permet la récupération des commentaires de la publication cible
 *
 * @params : req.params.id
 *
 * -- Resultat exemple :
 *
 * {
 * "idPublications": 76,
 * "titles": "titre de la publication",
 * "descriptions": "description de la publication",
 * "imagesUrl": "http://localhost:3000/images/78432148211609946509734.jpg",
 * "publicationsDate": "2021-01-06T15:21:49.000Z",
 * "commentCount": 0,
 * "likes": 0,
 * "dislikes": 0,
 * "usersId": 180,
 * "comment": [],
 * "user": {
 *     "names": "Versaille",
 *     "firstnames": "Louis",
 *     "image": "http://localhost:3000/images/44908592981609749963981.jpg",
 *    "idUsers": 180
 * }
 * }
 */

exports.getOnePublication = (req, res) => {
  const id = req.params.id;
  db.user
    .findOne({ where: { idUsers: userDecodedTokenId(req) } })

    .then((user) => {
      if (!user) {
        res.status(401).send({
          message: err.message || "Utilisateur non trouvé ",
        });
      }
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
