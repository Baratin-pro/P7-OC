"use strict";

const dbConfig = require("../config/db.config.js");
require("dotenv").config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USERS,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
/*
 * ********* Way to : models of Schema *********
 */
//User
db.user = require("./user.js")(sequelize, Sequelize);
//Publication
db.publication = require("./publication.js")(sequelize, Sequelize);
//Comment
db.comment = require("./comment.js")(sequelize, Sequelize);
//User_disliked
db.user_disliked = require("./user_disliked")(sequelize, Sequelize);
//User_liked
db.user_liked = require("./user_liked")(sequelize, Sequelize);
/*
 * ********* Association : User *********
 */
//User <--> Publication
db.user.hasMany(db.publication, {
  foreignKey: "usersId",
  as: "publication",
});
db.publication.belongsTo(db.user, {
  foreignKey: "usersId",
  as: "user",
});
//User <--> Comment
db.user.hasMany(db.comment, {
  foreignKey: "usersId",
  as: "comment",
});
db.comment.belongsTo(db.user, {
  foreignKey: "usersId",
  as: "user",
});
//User <--> user_disliked
db.user.hasMany(db.user_disliked, {
  foreignKey: "usersId",
  as: "user_disliked",
});
db.user_disliked.belongsTo(db.user, {
  foreignKey: "usersId",
  as: "user_disliked",
});
//User <--> user_liked
db.user.hasMany(db.user_liked, {
  foreignKey: "usersId",
  as: "user_liked",
});
db.user_liked.belongsTo(db.user, {
  foreignKey: "usersId",
  as: "user_liked",
});
/*
 * ********* Association : Publication *********
 */
//Publication <--> Comment
db.publication.hasMany(db.comment, {
  foreignKey: "publicationsId",
  as: "comment",
});
db.comment.belongsTo(db.publication, {
  foreignKey: "publicationsId",
  as: "publication",
});
//Publication <--> user_disliked
db.publication.hasMany(db.user_disliked, {
  foreignKey: "publicationsId",
  as: "publication_disliked",
});
db.user_disliked.belongsTo(db.publication, {
  foreignKey: "publicationsId",
  as: "publication_disliked",
});
//Publication <--> user_liked
db.publication.hasMany(db.user_liked, {
  foreignKey: "publicationsId",
  as: "publication_liked",
});
db.user_liked.belongsTo(db.publication, {
  foreignKey: "publicationsId",
  as: "publication_liked",
});

//Execution
module.exports = db;
