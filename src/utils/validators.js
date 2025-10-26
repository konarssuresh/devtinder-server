const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length > 50 || firstName.length < 4) {
    throw new Error("firstName  should be  4 to 50 characters");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("not a valid email");
  }
};

const validateKeys = (req, keys) => {
  let isValid = true;
  for (let key in req.body) {
    if (!keys.includes(key)) {
      isValid = false;
      throw new Error(`invalid key ${key} in the request`);
    }
  }
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    throw new Error("Invalid request");
  }
};

const validateUpdateprofile = (req) => {
  const ALLOWED_KEYS = ["firstName", "lastName", "photoUrl", "about", "skills"];

  validateKeys(req, ALLOWED_KEYS);
};

const validatePassword = (req) => {
  validateKeys(req, ["password"]);
  const { password } = req.body;
  if (!password) {
    throw new Error("password is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("not a strong password");
  }
};

module.exports = {
  validateKeys,
  validateSignupData,
  validateLoginData,
  validateUpdateprofile,
  validatePassword,
};
