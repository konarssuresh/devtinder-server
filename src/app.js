const express = require("express");

const app = express();

app.get("/user/:userid", (req, res) => {
  console.log(req.params);
  res.send({
    firstName: "Suresh",
    lastName: "Konar",
  });
});

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({
    firstName: "Suresh",
    lastName: "Konar",
  });
});

app.post("/user", (req, res) => {
  res.send("Data saved successfully");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully");
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("server listening on port 3000");
  }
});
