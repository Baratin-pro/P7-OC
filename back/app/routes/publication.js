const auth = require("../middleware/authJwt.js");
const multer = require("../middleware/multer-config.js");
const publication = require("../controllers/publication.js");
let router = require("express").Router();
module.exports = (app) => {
  //Router
  router.post("/create", auth, multer, publication.createPublication);
  router.get("/:id", auth, publication.getOnePublication);
  router.get("/", auth, publication.getAllPublication);
  router.put("/:id", auth, multer, publication.updatePublication);
  router.delete("/:id", auth, publication.deleteOnePublication);
  //Execution
  app.use("/api/publication", router);
};
