const { Schema, model } = require("mongoose");


const postSchema = Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  content: String,
  likes: Array

}, {
  timestamps: true
})

module.exports = model("Post", postSchema)
