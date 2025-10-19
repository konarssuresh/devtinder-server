const express = require("express");
const { connectDb } = require("./config/database");
const { User } = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("user created successfully");
  } catch (e) {
    res.status(400).send("Invalid request ");
  }
});

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
