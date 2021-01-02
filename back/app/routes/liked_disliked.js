"use strict";

const auth = require("../middleware/authJwt.js");
const liked_dislikedCtrl = require("../controllers/liked_disliked.js");
let router = require("express").Router();
module.exports = (app) => {
  //Router
  router.post("/liked", auth, liked_dislikedCtrl.liked);
  router.post("/disliked", auth, liked_dislikedCtrl.disliked);
  //Execution
  app.use("/api/", router);
};
