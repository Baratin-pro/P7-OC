"use strict";

const auth = require("../middleware/authJwt.js");
const commentCtrl = require("../controllers/comment.js");
let router = require("express").Router();
module.exports = (app) => {
  //Router
  router.post("/create", auth, commentCtrl.createComment);
  router.get("/:id", auth, commentCtrl.getComment);
  router.put("/:id", auth, commentCtrl.updateComment);
  router.delete("/:id", auth, commentCtrl.deleteComment);
  router.get("/publication/:id", auth, commentCtrl.getAllCommentsPublication);
  //Execution
  app.use("/api/comment", router);
};
