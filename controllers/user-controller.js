import Jimp from "jimp";
import bcrypt from "bcryptjs";
import { controlWrapper } from "../decorators/index.js";
import User from "../models/User.js";
import { cloudinary } from "../helpers/index.js";
import fs from "fs/promises";
import { HttpError } from "../helpers/HttpError.js";

const getUserInfo = (req, res) => {
  const { username, email, gender, avatarURL, waterNorma, date } = req.user;
  res.json({
    email,
    username,
    gender,
    avatarURL,
    waterNorma,
    date,
  });
};

const userAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;

  await Jimp.read(path)
    .then((img) => {
      return img.resize(128, 128).quality(75).write(path);
    })
    .catch((error) => {
      throw HttpError(404, error.message);
    });

  const { url: avatarURL } = await cloudinary.uploader.upload(path, {
    folder: "avatars",
  });

  await fs.unlink(path);

  const user = await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL: user.avatarURL,
  });
};

const updateUserInfo = async (req, res) => {
  const { _id } = req.user;
  const { newPassword } = req.body;
  const user = await User.findByIdAndUpdate(_id, {
    ...req.body,
  });
  if (newPassword) {
    const hashPasswd = await bcrypt.hash(newPassword, 10);
    user.password = hashPasswd;
  }
  res.status(200).json({
    email: user.email,
    username: user.username,
    gender: user.gender,
  });
};

const updateWaterNorma = async (req, res) => {
  const { _id } = req.user;
  const { waterNorma } = req.body;
  const user = await User.findByIdAndUpdate(_id, { waterNorma });
  res.status(200).json({
    waterNorma: user.waterNorma,
  });
};

export default {
  getUserInfo: controlWrapper(getUserInfo),
  userAvatar: controlWrapper(userAvatar),
  updateUserInfo: controlWrapper(updateUserInfo),
  updateWaterNorma: controlWrapper(updateWaterNorma),
};
