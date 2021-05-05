"use-strict";
import { ApolloError } from "apollo-server-errors";
import Comment from "../../models/Comment.js";

export default {
  Query: {
    comment: async (_, { postId }) => {
      try {
        const comment = await Comment.find({
          postId: postId,
        }).populate("user");

        return comment;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },

  Mutation: {
    createComment: async (_, { postId, text }, { user }) => {
      try {
        const comment = new Comment({
          postId: postId,
          text: text,
          user: user._id,
        });
        const result = await comment.save();
        await result.populate("user").execPopulate();
        return result;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
};
