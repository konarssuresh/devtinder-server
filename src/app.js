const express = require("express");
const { connectDb } = require("./config/database");
const { User } = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  let userObj = {
    firstName: "Suresh",
    lastName: "Konar",
    emailId: "konarssureshamazon@gmail.com",
    password: "testtesttest",
  };

  const user = new User(userObj);
  await user.save();

  res.status(201).send("user created successfully");
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
