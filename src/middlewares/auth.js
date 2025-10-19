const validateAdmin = (req, res, next) => {
  let token = "xyz";

  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("Admin not authenticated");
  }
};

const validateUser = (req, res, next) => {
  let token = "xyz";

  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("User not authenticated");
  }
};

module.exports = { validateAdmin, validateUser };
