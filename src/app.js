const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, (err) => {
      if (!err) {
        console.log("server listening on port 3000");
      }
    });
  })
  .catch(() => {
    console.log("error establishing connection");
  });
