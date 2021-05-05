"use-strict";
import postResolver from "./post.js";
import roomResolver from "./room.js";
import messageResolver from "./message.js";
import userResolver from "./user.js";
import commentResolver from "./comment.js";

export default [
  postResolver,
  userResolver,
  roomResolver,
  messageResolver,
  commentResolver,
];
