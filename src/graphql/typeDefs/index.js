import postTypeDef from "./post.js";
import messageTypeDef from "./message.js";
import roomTypeDef from "./room.js";
import userTypeDef from "./user.js";
import commentTypeDef from "./comment.js";
import { gql } from "apollo-server-express";

const linkSchema = gql`
  directive @isAuth on FIELD_DEFINITION
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [
  linkSchema,
  postTypeDef,

  userTypeDef,
  messageTypeDef,
  roomTypeDef,
  commentTypeDef,
];
