"use strict";

const auth = require("../middleware/authJwt.js");
const liked_dislikedCtrl = require("../controllers/liked_disliked.js");
let router = require("express").Router();
module.exports = (app) => {
  //Router
  router.post("/liked/add", auth, liked_dislikedCtrl.addLiked);
  router.post("/disliked/add", auth, liked_dislikedCtrl.addDisliked);
  router.delete("/liked/delete", auth, liked_dislikedCtrl.deleteLiked);
  router.delete("/disliked/delete", auth, liked_dislikedCtrl.deleteDisliked);
  //Execution
  app.use("/api/", router);
};
