const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      maxLength: 250,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("not a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender should be male,female,others");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.freepik.com/premium-psd/3d-render-avatar-character_51761375.htm#from_element=cross_selling__psd",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("not a valid photo url");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default desc of the user",
      maxLength: 200,
    },
    skills: {
      type: [String],
      validate(value) {
        for (let skill of value) {
          let count = value?.filter?.((v) => v === skill)?.length;
          if (count > 1) {
            throw new Error("Duplicate Skills exists");
          }
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "secret_key", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInput) {
  const user = this;
  const passwordHash = user.password;
  const isValid = await bcrypt.compare(passwordInput, passwordHash);
  return isValid;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
