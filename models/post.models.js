const { Schema, model } = require("mongoose");


const postSchema = Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  content: String,
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
      
    }]

}, {
  timestamps: true
})

module.exports = model("Post", postSchema)
