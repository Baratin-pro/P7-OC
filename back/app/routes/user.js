const auth = require("../middleware/authJwt.js");
const multer = require("../middleware/multer-config.js");
const userCtrl = require("../controllers/user.js");
let router = require("express").Router();

module.exports = (app) => {
  //Router
  router.post("/signup", userCtrl.signup);
  router.post("/login", /* user.limiter, */ userCtrl.login);
  router.get("/:id", auth, userCtrl.getOneUser);
  router.get("", auth, userCtrl.getAllUsers);
  //router.delete("/:id", user.deleteUser); // A finir
  router.put("/:id", auth, multer, userCtrl.updateUserImage);
  app.use("/api/user", router);
};

/**
 * *******Like*****
 * post --> Envoyer
 * get --> Afficher
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
