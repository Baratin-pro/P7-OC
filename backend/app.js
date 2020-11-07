const express = require("express"); // Framework express
const helmet = require("helmet"); // Protects against various attacks
const bodyParser = require("body-parser"); // Recovery object for POST
const path = require("path"); // Provides a way of working with directories and file paths.
const app = express();

/*
 *   Routes : API
 */
const userRoutes = require("./routes/user.js");
/*
 *   Connection : database
 */
/* const Sequelize = require("sequelize");

// Sequelize:
const sequelize = new Sequelize("groupomania", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then((e) => console.log("Connexion à réussie !"))
  .catch((e) => console.log("Connexion à MySQL échouée ! :", e)); */
/*
 *   Control : Cors and Methods
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
/*
 *   Processing requests
 */
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(helmet());
app.use(bodyParser.json());
app.use("/api/auth", userRoutes);
/*
 *   Execution
 */
module.exports = app;
