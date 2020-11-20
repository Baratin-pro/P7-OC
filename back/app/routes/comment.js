const auth = require("../middleware/authJwt.js");

module.exports = (app) => {
  const commentCtrl = require("../controllers/comment.js");
  let router = require("express").Router();
  //Router
  router.post("/create", auth, commentCtrl.createComment);
  router.get("/:id", auth, commentCtrl.getComment);
  router.put("/:id", auth, commentCtrl.updateComment);
  router.delete("/:id", auth, commentCtrl.deleteComment);
  //Execution
  app.use("/api/comment", router);
};
