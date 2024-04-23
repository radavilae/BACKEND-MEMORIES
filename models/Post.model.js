const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const PostSchema = new Schema({
  title: { String, requiered: true },
  message: { String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Post = model("Post", PostSchema);

module.exports = Post;
