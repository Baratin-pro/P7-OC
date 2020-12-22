"use strict";

//Node.js ==> Express Framework
const express = require("express");
const app = express();
//Protect
const helmet = require("helmet");
app.use(helmet());
//Path
const path = require("path");
//Cors
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
//req.body object
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Sync database
const db = require("./models");
db.sequelize.sync();
// image path on the server
app.use("/images", express.static(path.join(__dirname, "images")));
//Router
require("./routes/user.js")(app);
require("./routes/publication.js")(app);
require("./routes/comment.js")(app);
require("./routes/liked_disliked.js")(app);
module.exports = app;
