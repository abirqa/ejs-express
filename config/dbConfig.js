const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});