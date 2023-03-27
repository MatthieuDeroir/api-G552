const express = require("express");
const authentification = require("../Controllers/authController");

const router = express.Router();


router.post("/signup", authentification.signUp);
router.post("/signin", authentification.signIn);
module.exports = router;
