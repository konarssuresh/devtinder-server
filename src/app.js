const express = require("express");
const { connectDb } = require("./config/database");
const { User } = require("./models/user");
const {
  validateSignupData,
  validateKeys,
  validateLoginData,
} = require("./utils/validators");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const ALLOWED_KEYS = ["firstName", "lastName", "emailId", "password"];

  try {
    validateSignupData(req);
    validateKeys(req, ALLOWED_KEYS);
    const { password, firstName, lastName, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    let { emailId, password } = req.body;
    let user = await User.findOne({ emailId });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.send("Login successful");
      } else {
        res.status(400).send("invalid emailid or password");
      }
    } else {
      res.status(400).send("invalid emailid or password");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const resp = await User.findOne({
      emailId: userEmail,
    });

    if (resp === null) {
      res.status(404).send("User not Found");
    } else {
      res.send(resp);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("error fetching user by email");
  }
});

// feed api- get all users from database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send("something went wrong");
  }
});

app.get("/userbyid", async (req, res) => {
  const id = req.body.id;
  try {
    let user = await User.findById(id);
    if (user === null) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.id;
  try {
    const dbResp = await User.findByIdAndDelete(id);
    if (dbResp === null) {
      res.status(404).send("User not found");
    } else {
      res.send(dbResp);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const data = req.body;
  const id = data.id;
  const ALLOWED_KEYS = [
    "id",
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  delete data.id;

  try {
    let isValid = true;
    for (let key in req.body) {
      if (!ALLOWED_KEYS.includes(key)) {
        isValid = false;
        res.status(400).send(`invalid key ${key} in the request`);
        break;
      }
    }
    if (isValid) {
      const user = await User.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
      });
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.send(user);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
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
