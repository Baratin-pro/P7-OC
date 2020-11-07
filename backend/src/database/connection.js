const Sequelize = require("sequelize");

// Sequelize:
const sequelize = new Sequelize("groupomania", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
/* 
sequelize
  .authenticate()
  .then((e) => console.log("Connexion à réussie !"))
  .catch((e) => console.log("Connexion à MySQL échouée ! :", e)); */

module.exports = sequelize;
global.sequelize = sequelize;
