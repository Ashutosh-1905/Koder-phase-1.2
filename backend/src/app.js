const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const  authRouter = require("./routes/auth.router");
const  productRouter = require("./routes/product.router");
const paymentRouter = require("./routes/payment.router");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/payments",paymentRouter);

module.exports = app;