const express = require("express"); //Importing the express package

const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/signup", authController.getSingup); //Serving the sign up page not for storing data

router.post("/signup", authController.signup); //Ok to have same path as long as different HTTP method they handle

router.get("/login", authController.getLogin); //Not executing func. here Express would do it for us

router.post("/login", authController.login);

router.post("/logout", authController.logout);

module.exports = router;
