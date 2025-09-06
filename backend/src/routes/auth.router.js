const express = require("express");
const { registerUser, loginUser, registerSeller } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/user/register", registerUser)

router.post("/user/login", loginUser)

router.post("/seller/register", registerSeller)


module.exports = router;