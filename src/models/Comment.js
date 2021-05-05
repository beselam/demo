"use-strict";
import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    text: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("comment", CommentSchema);
