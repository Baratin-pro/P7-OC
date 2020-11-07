//Node.js ==> Express Framework
const express = require("express");
let app = express();

//req.body property
const bodyParser = require("body-parser");

//Path
const path = require("path");

//Protects against various attacks
const helmet = require("helmet");

//Router API
//const userRoutes = require("./routes/user.js");

//DB Connection
require("./src/database/connection.js");

//Control : Cors and Methods
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

//Processing requests
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(helmet());
app.use(bodyParser.json());
//app.use("/api/auth", userRoutes);

//Execution
module.exports = app;
