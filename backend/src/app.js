const cookieParser = require("cookie-parser");
const express = require("express");

const  userRouter = require("./routes/user.router");
const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/users", userRouter);
module.exports = app;