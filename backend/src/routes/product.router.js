const express = require("express");
const multer = require("multer");
const { authSeller } = require("../middlewares/auth.middleware");
const { createProduct, getSellerProducts, getAllProducts, getProductById } = require("../controllers/product.controller");

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});


router.post("/",authSeller, upload.array("images", 5), createProduct);
router.get("/seller",authSeller, getSellerProducts);
router.get("/", getAllProducts);
router.get("/:id", getProductById);


module.exports = router;