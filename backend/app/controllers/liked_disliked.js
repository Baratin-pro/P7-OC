"use strict";

//Way to model
const db = require("../models");
let user;
let publication;
let countDisliked;
let countLiked;

exports.liked = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const id = Number(req.body.id);
    const user = await db.user.findOne({ where: { id: userId } });
    const publication = await db.publication.findOne({ where: { id: id } });

    if (!user) {
      res.status(401).send({ message: "Utilisateur non trouvé " });
    } else if (!publication) {
      res.status(401).send({ message: "Publication non trouvée " });
    } else {
      db.user_liked
        .findOne({
          where: {
            userId: user.id,
            publicationId: publication.id,
          },
        })
        .then((userCheckPresence) => {
          if (userCheckPresence) {
            userCheckPresence.destroy();
            return db.user_liked
              .findAndCountAll({
                where: { publicationId: publication.id },
              })
              .then((user_likedFindAndCountAll) => {
                return publication.update({
                  like: user_likedFindAndCountAll.count,
                });
              })
              .then(() => {
                res.status(200).send({ message: "Liked supprimé " });
              });
          } else {
            return db.user_liked.create({
              userId: user.id,
              publicationId: publication.id,
            });
          }
        })
        .then(() => {
          return db.user_disliked.findOne({
            where: {
              userId: user.id,
              publicationId: publication.id,
            },
          });
        })
        .then((disliked) => {
          if (disliked) {
            disliked.destroy();
          }
          return db.user_disliked.findAndCountAll({
            where: { publicationId: publication.id },
          });
        })

        .then((user_dislikedFindAndCountAll) => {
          countDisliked = user_dislikedFindAndCountAll;
          return db.user_liked.findAndCountAll({
            where: { publicationId: publication.id },
          });
        })

        .then((user_likedFindAndCountAll) => {
          countLiked = user_likedFindAndCountAll;
          return publication.update({
            dislike: countDisliked.count,
            like: countLiked.count,
          });
        })
        .then(() => {
          res.status(201).send({ message: "Liked rajouté" });
        });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

exports.disliked = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const id = Number(req.body.id);
    const user = await db.user.findOne({ where: { id: userId } });
    const publication = await db.publication.findOne({ where: { id: id } });

    if (!user) {
      res.status(401).send({ message: "Utilisateur non trouvé " });
    } else if (!publication) {
      res.status(401).send({ message: "Publication non trouvée " });
    } else {
      db.user_disliked
        .findOne({
          where: {
            userId: user.id,
            publicationId: publication.id,
          },
        })
        .then((userCheckPresence) => {
          if (userCheckPresence) {
            userCheckPresence.destroy();
            return db.user_disliked
              .findAndCountAll({
                where: { publicationId: publication.id },
              })
              .then((user_dislikedFindAndCountAll) => {
                return publication.update({
                  dislike: user_dislikedFindAndCountAll.count,
                });
              })
              .then(() => {
                res.status(200).send({ message: "Disliked supprimé " });
              });
          } else {
            return db.user_disliked.create({
              userId: user.id,
              publicationId: publication.id,
            });
          }
        })
        .then(() => {
          return db.user_liked.findOne({
            where: {
              userId: user.id,
              publicationId: publication.id,
            },
          });
        })
        .then((liked) => {
          if (liked) {
            liked.destroy();
          }
          return db.user_disliked.findAndCountAll({
            where: { publicationId: publication.id },
          });
        })

        .then((user_dislikedFindAndCountAll) => {
          countDisliked = user_dislikedFindAndCountAll;
          return db.user_liked.findAndCountAll({
            where: { publicationId: publication.id },
          });
        })

        .then((user_likedFindAndCountAll) => {
          countLiked = user_likedFindAndCountAll;
          return publication.update({
            dislike: countDisliked.count,
            like: countLiked.count,
          });
        })
        .then(() => {
          res.status(201).send({ message: "Disliked rajouté" });
        });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};
