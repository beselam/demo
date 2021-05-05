"use-strict";
import { ApolloError } from "apollo-server-errors";
import Room from "../../models/Room.js";
import Message from "../../models/Message.js";

export default {
  Query: {
    singleRoom: async (_, { postId, usersId }) => {
      try {
        const room = await Room.findOne({
          users: { $all: usersId },
          postId: postId,
        });

        return room;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    userRoomList: async (_, args, { user }) => {
      try {
        const room = await Room.find({
          users: user._id,
        })
          .populate("users")
          .populate("postId");

        return room;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },

  Mutation: {
    createRoom: async (_, { newRoom }) => {
      try {
        const room = new Room({ ...newRoom });

        const result = await room.save();
        return result;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    deleteRoom: async (_, { roomId }) => {
      try {
        const result = await Room.deleteOne({ _id: roomId });
        const messages = await Message.deleteMany({ roomId: roomId });
        return true;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
};
