const mongoose = require("mongoose");

const connectDb = async () => {
  mongoose.connect(
    "mongodb+srv://test:test@cluster0.le9p0pq.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = { connectDb };
