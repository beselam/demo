import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    comment(postId: ID!): [Comment]! @isAuth
  }

  extend type Mutation {
    createComment(postId: ID!, text: String!): Comment! @isAuth
  }
  type Comment {
    id: ID!
    text: String!
    user: User
    createdAt: String!
  }
`;
