const auth = require("../middleware/authJwt.js");
const multer = require("../middleware/multer-config.js");
const publicationCtrl = require("../controllers/publication.js");
let router = require("express").Router();
module.exports = (app) => {
  //Router
  router.post("/create", auth, multer, publicationCtrl.createPublication);
  router.get("/:id", auth, publicationCtrl.getOnePublication);
  router.get("/", auth, publicationCtrl.getAllPublication);
  router.put("/:id", auth, multer, publicationCtrl.updatePublication);
  router.delete("/:id", auth, publicationCtrl.deleteOnePublication);
  //Execution
  app.use("/api/publication", router);
};
