"use-strict";
import { ApolloError } from "apollo-server-errors";
import { withFilter } from "graphql-subscriptions";
import Message from "../../models/Message.js";
import Room from "../../models/Room.js";

/**
 * message resolver
 */

const SUBSCRIBE_FOR_NEW_MESSAGE = "SUBSCRIBE_FOR_NEW_MESSAGE";
export default {
  Query: {
    message: async (_, { id }) => {
      try {
        console.log(id);
        const message = await Message.find({ roomId: id })
          .populate("user")
          .populate("receiver")
          .sort({ createdAt: -1 });
        return message;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },

  Mutation: {
    createMessage: async (_, { newMessage }, { pubsub }) => {
      try {
        const room = await (async () => {
          if (newMessage.roomId) {
            return newMessage.roomId;
          } else {
            const users = [newMessage.user, newMessage.receiver];
            const postID = newMessage.postId;
            const room = await Room.findOne({
              users: { $all: users },
              postId: postID,
            });

            if (room) {
              return room._id;
            }
            const newRoom = new Room({
              postId: newMessage.postId,
              users: [newMessage.user, newMessage.receiver],
            });
            await newRoom.save();
            return newRoom._id;
          }
        })();
        newMessage.roomId = room;
        const message = new Message({ ...newMessage });
        const result = await message.save();
        const mm = result;
        const jj = await result
          .populate("user")
          .populate("receiver")
          .execPopulate();
        pubsub.publish(SUBSCRIBE_FOR_NEW_MESSAGE, {
          newSubscriptionMessage: jj,
        });

        return mm;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
  Subscription: {
    newSubscriptionMessage: {
      subscribe: withFilter(
        (_, args, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIBE_FOR_NEW_MESSAGE),
        (payload, variables) => {
          console.log("payload", payload);
          console.log("variables", variables);
          const roomId = payload.newSubscriptionMessage.roomId;
          const postId = payload.newSubscriptionMessage.postId;

          return roomId == variables.roomId && postId == variables.postId;
        }
      ),
    },
  },
};

/* Subscription: {
    newSubscriptionMessage: {
      subscribe: (_, args, { pubsub }) => {
        return pubsub.asyncIterator(SUBSCRIBE_FOR_NEW_MESSAGE);
      },
    },
  },
  */
