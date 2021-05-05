"use-strict";
import mongoose from "mongoose";
import { DB_URL } from "../config/index.js";

const connectMongo = async () => {
  try {
    const connection = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    return connection;
  } catch (err) {
    console.error("Connection to db failed", err);
  }
};

export default connectMongo;
