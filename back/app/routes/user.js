const auth = require("../middleware/authJwt.js");

module.exports = (app) => {
  const user = require("../controllers/user.js");
  let router = require("express").Router();
  router.post("/signup", user.signup); //Check
  router.post("/login", /* user.limiter, */ user.login); //Check
  router.get("/:id", auth, user.compte); //check
  router.get("", user.getAllUsers); //Check
  //router.delete("/:id", user.deleteUser); // A finir
  router.put("/:id", user.updateUser); // need update for post
  app.use("/api/user", router);
};
