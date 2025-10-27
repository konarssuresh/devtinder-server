const express = require("express");
const { validateUser } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connection-request");
const { User } = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  validateUser,
  async (req, res) => {
    try {
      let fromUser = req.user;
      const status = req.params.status;
      const fromUserId = fromUser._id;
      const toUserId = req.params.toUserId;

      const ALLOWED_VALUES = ["ignored", "interested"];
      if (!ALLOWED_VALUES.includes(status)) {
        throw new Error("Invalid status value" + status);
      }
      let toUserDetails = await User.findById(toUserId);
      if (!toUserDetails) {
        throw new Error(`User with id ${toUserId} does not exists`);
      }

      let existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      let request = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await request.save();
      res.json({
        message: "Request sent successfully",
        data,
      });
    } catch (e) {
      res.status(400).send("Error: " + e?.message);
    }
  }
);

module.exports = requestRouter;
