const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//User
db.user = require("./user.js")(sequelize, Sequelize);
//Publication
db.publication = require("./publication.js")(sequelize, Sequelize);
//Comment
db.comment = require("./comment.js")(sequelize, Sequelize);

//Publication <--> Comment
db.publication.hasMany(db.comment, {
  foreignKey: "publicationsId",
  as: "comment",
});
db.comment.belongsTo(db.publication, {
  foreignKey: "publicationsId",
  as: "publication",
});

module.exports = db;
