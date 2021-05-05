"use-strict";
import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    authUserProfile: User! @isAuth
    getUsers: [User] @isAuth
    loginUser(email: String!, password: String!): AuthResponse!
  }

  extend type Mutation {
    registerUser(newUser: UserInput!): AuthResponse!
    updateProfilePic(picture: Upload!): User! @isAuth
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
    avatar: Upload
  }
  type User {
    _id: ID!
    name: String!
    email: String!
    avatar: String!
  }

  type AuthResponse {
    token: String
    user: User!
  }
`;
