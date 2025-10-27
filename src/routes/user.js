const express = require("express");
const { validateUser } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connection-request");
const { User } = require("../models/user");

const userRouter = express.Router();

const USER_ALLOWED_FIELDS =
  "firstName lastName age gender skills photoUrl about";

userRouter.get("/user/requests/received", validateUser, async (req, res) => {
  try {
    let toUser = req.user;
    let data = await ConnectionRequest.find({
      toUserId: toUser._id,
      status: "interested",
    }).populate("fromUserId", USER_ALLOWED_FIELDS);

    res.json({ message: "Data retrieved successfully", data });
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

userRouter.get("/user/connections", validateUser, async (req, res) => {
  try {
    let loggedInUser = req.user;

    let requestsData = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_ALLOWED_FIELDS)
      .populate("toUserId", USER_ALLOWED_FIELDS);

    let data = requestsData.map((req) => {
      if (req.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return req.toUserId;
      }
      return req.fromUserId;
    });

    res.send(data);
  } catch (e) {
    res.status(400).send(`Error - ${e?.message}`);
  }
});

userRouter.get("/user/feed", validateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser._id;
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = Math.min(100, limit);

    let skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    let hideSet = new Set();

    connectionRequests.forEach((request) => {
      hideSet.add(request.fromUserId.toString());
      hideSet.add(request.toUserId.toString());
    });

    const users = await User.find({
      $and: [{ _id: { $ne: userId } }, { _id: { $nin: [...hideSet] } }],
    })
      .skip(skip)
      .limit(limit)
      .select(USER_ALLOWED_FIELDS);

    res.send(users);
  } catch (e) {
    res.status(400).send(`Error ${e?.message}`);
  }
});

module.exports = userRouter;
