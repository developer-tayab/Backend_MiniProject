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
  profilePic: {
    type: String,
    default: "default.png"
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  ]

}, {
  timestamps: true
})

module.exports = model("User", userSchema)
