import { gql, GraphQLUpload } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllPosts: [Post]
    getPostByPageAndLimit(page: Int, limit: Int): PostPaginator! @isAuth
    getAuthenticatedUserPost(page: Int, limit: Int): PostPaginator! @isAuth
    getUserPosts: [Post] @isAuth
    getPostByCategory(category: String!): [Post] @isAuth
    getPostByLocation(long: Float!, lat: Float!, maxDistance: Int!): [Post]
      @isAuth
  }

  extend type Mutation {
    createNewPost(newPost: NewPost!): Boolean! @isAuth
    updatePost(post: postUpdate): Post! @isAuth
    deletePost(id: ID!): Boolean! @isAuth
  }

  input NewPost {
    title: String!
    description: String!
    price: String!
    category: String!
    featuredImage: [Upload]!
    location: LocData
  }

  input LocData {
    type: String = "Point"
    coordinates: [Float]
  }

  input postUpdate {
    id: ID!
    title: String
    description: String
    price: String
    category: String
    featuredImage: [String]
    createdAt: String
    updatedAt: String
  }

  type PostPaginator {
    posts: [Post!]!
    paginator: Paginator!
  }
  type Paginator {
    slNo: Int
    prev: Int
    next: Int
    perPage: Int
    totalPosts: Int
    totalPages: Int
    currentPage: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
  }
  type Post {
    id: ID
    title: String!
    description: String!
    category: String!
    price: String!
    featuredImage: [String]
    createdAt: String
    updatedAt: String
    author: User!
    location: Detail
  }
  type Detail {
    type: String
    coordinates: [Float]
  }

  type Subscription {
    newSubscriptionMessage(roomId: ID, postId: ID): Message!
  }
`;
// newSubscriptionMessage(roomId: ID, postId: ID): Message!
