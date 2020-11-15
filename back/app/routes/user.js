const auth = require("../middleware/authJwt.js");
const multer = require("../middleware/multer-config.js");

module.exports = (app) => {
  const user = require("../controllers/user.js");
  let router = require("express").Router();
  router.post("/signup", user.signup); //Check
  router.post("/login", /* user.limiter, */ user.login); //Check
  router.get("/:id", auth, user.compte); //check
  router.get("", auth, user.getAllUsers); //Check
  //router.delete("/:id", user.deleteUser); // A finir
  router.put("/:id", auth, multer, user.updateUserImage); // need update for post
  app.use("/api/user", router);
};
