const express = require("express");
const { registerUser, loginUser, registerSeller, getCurrentUser, logout } = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

router.post("/seller/register", registerSeller);
router.post("/seller/login", loginUser);

router.get("/me",authUser, getCurrentUser);
router.post("/logout", logout);

module.exports = router; 