const mongoose = require("mongoose");

const establishConnection = async () => {
  try {
    const x = await mongoose.connect(
      "mongodb+srv://test:test@cluster0.le9p0pq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("database connection established");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { establishConnection };
