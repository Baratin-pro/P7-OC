const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user.js");

router.post("/signup", userCtrl.signup);
//router.post("/login", userCtrl.limiter, userCtrl.login);
//router.get("/users", userCtrl.getAllUser);
//router.get("/users/:id", userCtrl.getOneUser);
//router.put("/users/:id", userCtrl.modifyUser);
//router.delete("/users/:id", userCtrl.deleteUser);

module.exports = router;
