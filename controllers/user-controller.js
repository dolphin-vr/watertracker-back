// import Jimp from "jimp";
import bcrypt from "bcryptjs";
import { controlWrapper } from "../decorators/index.js";
import User from "../models/User.js";
import { cloudinary } from "../helpers/index.js";
import fs from "fs/promises";

const getUserInfo = (req, res) => {
  const { username, email, gender, avatarURL } = req.user;
  res.json({
    email,
    username,
    gender,
    avatarURL,
  });
};

const userAvatar = controlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
    folder: "avatars",
  });
  await fs.unlink(req.file.path);

  const user = await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(201).json({
    avatarURL,
    message: "Avatar added successfully",
  });
});

const updateUserInfo = controlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { newpassword } = req.body;
  const user = await User.findByIdAndUpdate(_id, {
    ...req.body,
  });
  if (newpassword) {
    const hashPasswd = await bcrypt.hash(newpassword, 10);
    user.password = hashPasswd;
  }
  res.json({
    email: user.email,
    username: user.username,
    gender: user.gender,
    message: "User info is updated",
  });
});

export default {
  getUserInfo,
  userAvatar,
  updateUserInfo,
};
