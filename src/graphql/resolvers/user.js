"use-strict";
import { ApolloError } from "apollo-server-errors";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import {
  issueAuthToken,
  serializeUser,
} from "../../utilities/authentication.js";
import {
  UserAuthenticationRules,
  UserRegistrationRules,
} from "../../validators/userValidation.js";

import { createWriteStream, mkdir } from "fs";
import shortid from "shortid";
import { PORT, URL } from "../../config/index.js";

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

export default {
  Query: {
    getUsers: async () => {
      const users = User.find();
      return users;
    },
    authUserProfile: async (_, args, { user }) => {
      return {
        name: user.name,
        _id: user._id,
        email: user.email,
        avatar: user.avatar,
      };
    },
    loginUser: async (_, { email, password }) => {
      try {
        await UserAuthenticationRules.validate(
          { email, password },
          { abortEarly: false }
        );
        let user = await User.findOne({ email });
        if (!user) {
          throw new Error("user not found");
        }
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid user");
        }
        user = user.toObject();

        user = await serializeUser(user);

        let token = await issueAuthToken(user);
        return {
          token,
          user: user,
        };
      } catch (e) {
        throw new ApolloError(e.message, 403);
      }
    },
  },

  Mutation: {
    registerUser: async (_, { newUser }) => {
      try {
        let { email, name, password } = newUser;
        console.log(newUser);
        await UserRegistrationRules.validate(
          { name, password, email },
          { abortEarly: false }
        );

        let user = await User.findOne({ name });

        if (user) {
          throw new Error("Username is already taken.", "403");
        }
        user = await User.findOne({ email });
        if (user) {
          throw new Error("Email is already registered.", "403");
        }

        user = new User(newUser);

        user.password = await bcrypt.hash(user.password, 10);

        let result = await user.save();

        result = result.toObject();

        result = serializeUser(result);

        let token = await issueAuthToken(result);
        console.log(token);
        return {
          token,
          user: result,
        };
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },

    updateProfilePic: async (_, { picture }, { user }) => {
      try {
        const file = await storeUpload(picture);
        const pic = await User.findOneAndUpdate(
          { _id: user._id },
          { avatar: file },
          {
            new: true,
          }
        );
        return pic;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
};
