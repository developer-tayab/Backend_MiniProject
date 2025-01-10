const { mongoose, Schema, model } = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Backend_MiniProject").then(() => {
  console.log("MongoDB is connected is successfully.");
})

const userSchema = Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  age: Number,
  post: Array

}, {
  timestamps: true
})

module.exports = model("User", userSchema)
