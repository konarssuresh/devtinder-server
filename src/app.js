const express = require("express");
const { validateAdmin, validateUser } = require("./middlewares/auth");

const app = express();

app.use("/admin", validateAdmin);
app.get("/admin/getAllUsers", (req, res) => {
  res.send("sent all users");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send("deleted user successfully");
});

app.post("/user/login", (req, res) => {
  throw new Error("wdwdwdwdwdwd");
  res.send("user logged in successfully");
});

app.use("/user", validateUser);
app.get("/user", (req, res) => {
  res.send("sent user details");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(err);
    // log the error
    res.status(500).send("somthing went wrong");
  }
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("server listening on port 3000");
  }
});
