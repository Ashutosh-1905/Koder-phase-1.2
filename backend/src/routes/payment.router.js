const express = require ("express");
const { authUser } = require("../middlewares/auth.middleware");
const { createPayment, verifyPayment } = require("../controllers/payment.controller");

const router = express.Router();

/* POST /api/payments/create/productId */
router.post("/create/:productId",authUser, createPayment);

/* POST /api/payments/verify */
router.post("/verify", authUser, verifyPayment);

module.exports = router;
