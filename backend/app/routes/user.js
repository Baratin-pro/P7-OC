"use strict";

const auth = require("../middleware/authJwt.js");
const multer = require("../middleware/multer-config.js");
const userCtrl = require("../controllers/user.js");
let router = require("express").Router();
module.exports = (app) => {
  //Router
  router.post("/signup", userCtrl.signup);
  router.post("/login", userCtrl.limiter, userCtrl.login);
  router.get("/profil", auth, userCtrl.getOneUser);
  router.get("", auth, userCtrl.getAllUsers);
  router.delete("/:id", auth, userCtrl.deleteUser);
  router.put("/update", auth, multer, userCtrl.updateUserImage);
  //Execution
  app.use("/api/user", router);
};