const cookieParser = require("cookie-parser");
const express = require("express");

const  authRouter = require("./routes/auth.router");
const  productRouter = require("./routes/product.router");
const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/products", productRouter)


module.exports = app;