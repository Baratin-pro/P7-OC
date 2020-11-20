module.exports = (app) => {
  const auth = require("../middleware/authJwt.js");

  const multer = require("../middleware/multer-config.js");
  const publication = require("../controllers/publication.js");

  let router = require("express").Router();

  router.post("/create", auth, multer, publication.createPublication); // Check
  router.get("/:id", auth, publication.getOnePublication); // Check
  router.get("/", auth, publication.getAllPublication); //Check
  router.delete("/:id", auth, publication.deleteOnePublication); // non

  app.use("/api/publication", router);
};

/**
 * Publication
 * post / multer --> Envoyer
 * get  --> Read lire one solo
 * getAll --> Afficher all
 * put / multer --> upddate
 * delete --> supprimer
 *
 * *******Like*****
 * post --> Envoyer
 * get --> Afficher
 *
 * ***********Comment*********
 * post --> Envoyer
 * put --> update
 * delete --> supprimer
 * get -->
 * get all
 *
 * ***********Research**********
 * post
 * get
 * **********User*********
 * post
 * delete
 * put
 * get
 * getAll
 */
