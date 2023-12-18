const express = require("express");
const authentification = require("../Controllers/authController");

const router = express.Router();


router.post("/signup", authentification.signUp);
router.post("/signing", authentification.signIn);
router.post("/modifyPassword/:id", authentification.modifyPassword);

module.exports = router;
