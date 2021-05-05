"use-strict";
import PostModel from "../../models/Post.js";
import RoomModel from "../../models/Room.js";
import MessageModel from "../../models/Message.js";
import { createWriteStream, mkdir } from "fs";
import shortid from "shortid";
import { ApolloError } from "apollo-server-errors";
import { NewPostRules } from "../../validators/postValidator.js";
import { URL, PORT } from "../../config/index.js";

/**
 * post resolver
 */

// labels for pagination
const PostLabels = {
  docs: "posts",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalPosts",
  totalPages: "totalPages",
};

// create Readstream and path and store the image file
const storeUpload = async (file) => {
  const { createReadStream, filename, mimetype } = await file;
  const stream = await createReadStream();
  const id = shortid.generate();
  let path = `src/uploads/${id}-${filename}`;
  await stream.pipe(createWriteStream(path));
  path = `${URL}:${PORT}/${path}`;
  return path;
};

const NEW_USER = "NEW_USER";

export default {
  Query: {
    getAllPosts: async (_, args, { pubsub }) => {
      let posts = await PostModel.find()
        .populate("author", { password: 0 })
        .sort({ createdAt: -1 });

      return posts;
    },
    getUserPosts: async (_, args, { user }) => {
      try {
        let posts = await PostModel.find({ author: user._id }).sort({
          createdAt: 1,
        });
        return posts;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostByCategory: async (_, { category }) => {
      try {
        let posts = await PostModel.find({ category: category })
          .populate("author")
          .sort({ createdAt: 1 });
        return posts;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostByLocation: async (_, { long, lat, maxDistance }) => {
      try {
        let posts = await PostModel.find({
          location: {
            $near: {
              $maxDistance: maxDistance,
              $geometry: { type: "Point", coordinates: [long, lat] },
            },
          },
        })
          .populate("author")
          .sort({ createdAt: 1 });

        return posts;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostByPageAndLimit: async (_, { page, limit }) => {
      try {
        const options = {
          page: page || 1,
          limit: limit || 10,
          sort: {
            createdAt: -1,
          },
          populate: "author",
          customLabels: PostLabels,
        };

        let post = await PostModel.paginate({}, options);

        return post;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },

  Mutation: {
    createNewPost: async (_, { newPost }, { user }) => {
      try {
        const { title, description, price, featuredImage } = await newPost;
        await NewPostRules.validate(
          { title, description, price },
          { abortEarly: false }
        );
        const files = await Promise.all(featuredImage.map(await storeUpload));

        newPost.featuredImage = files;
        const post = new PostModel({ ...newPost, author: user._id });
        const result = await post.save();

        return true;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },

    updatePost: async (_, args, { user }) => {
      try {
        const { post } = args;

        const postO = await PostModel.findOneAndUpdate(
          { _id: post.id, author: user._id.toString() },
          { ...post },
          {
            new: true,
          }
        );
        if (!postO) {
          throw new Error("unable to edit post");
        }
        return postO;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },

    deletePost: async (_, { id }, { user }) => {
      try {
        const deletedPost = await PostModel.findOneAndDelete({
          _id: id,
          author: user._id.toString(),
        });
        if (!deletedPost) {
          throw new Error("unable delete post");
        }
        await RoomModel.deleteMany({ postId: id });
        await MessageModel.deleteMany({ postId: id });

        return true;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
};
