const mongoose = require("mongoose");
const express = require("express");

const { LOCAL_DB, MONGODB_CLUSTER } = process.env;
const app = express();

exports.connect = () => {
  const dbPath = process.env.DB_PATH;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  return mongoose
    .connect(dbPath, options)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};
