const db = require("../models");
const Publication = db.publication;
const Op = db.Sequelize.Op;

exports.createPublication = (req, res) => {
  const publication = {
    titles: req.body.titles,
    descriptions: req.body.descriptions,
    imagesUrl: req.body.imagesUrl,
    likes: 0,
    dislikes: 0,
    usersId: 2,
  };
  Publication.create(publication)
    .then(() => {
      res.status(201).send({ message: "Publication créé avec succes" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produit lors de la création de la Publication",
      });
    });
};
exports.getOnePublication = (req, res) => {
  const id = req.params.id;
  Publication.findOne({
    where: { idPublications: id },
    attributes: [
      "usersId",
      "idPublications",
      "titles",
      "descriptions",
      "imagesUrl",
      "publicationsDate",
      "likes",
      "dislikes",
    ],
  })
    .then((publication) => {
      res.status(200).send({ publication });
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
exports.getAllPublication = (req, res) => {
  /* const idPublications = req.query.idPublications;
  let condition = idPublications
    ? { idPublications: { [Op.like]: `%${idPublications}%` } }
    : null; */

  Publication.findAll({
    include: ["comment"],
    /*  where: condition,
    attributes: [
      "usersId",
      "idPublications",
      "titles",
      "descriptions",
      "imagesUrl",
      "publicationsDate",
      "likes",
      "dislikes",
    ], */
  })
    .then((userAll) => {
      res.status(200).send(userAll);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération des idPublications",
      });
    });
};
exports.deleteOnePublication = (req, res) => {
  const id = req.params.id;
  Publication.findOne({ where: { idPublications: id } })
    .then(() => {
      Publication.destroy({ where: { idPublications: id } })
        .then(() => {
          res
            .status(200)
            .send({ message: "Publication supprimé avec succès !" });
        })
        .catch((err) => {
          res
            .status(400)
            .send({ message: err.message || "Publication non trouvé !" });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Impossible de supprimer Publication avec :" + id,
      });
    });
};
