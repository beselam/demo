import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    message(id: ID!): [Message] @isAuth
  }

  extend type Mutation {
    createMessage(newMessage: NewMessage!): Message @isAuth
  }
  input NewMessage {
    postId: ID!
    roomId: ID
    user: ID!
    receiver: ID!
    text: String!
  }
  type Message {
    roomId: ID
    postId: ID
    _id: ID!
    user: User!
    receiver: User!
    text: String!
  }
`;
