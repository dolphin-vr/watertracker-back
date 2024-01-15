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
    username: username || "",
    gender: gender || "",
    avatarURL: avatarURL || "",
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
      throw new HttpError(404, error.message);
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
  const { password, newPassword } = req.body;
  let updateUser = {};
  if (password) {
    const user = await User.findById(_id);
    const isPasswdOK = await bcrypt.compare(password, user.password);
    if (!isPasswdOK) {
      throw new HttpError(401, "Password is invalid");
    }
    const hashPasswd = await bcrypt.hash(newPassword, 10);
    updateUser = await User.findByIdAndUpdate(_id, {
      ...req.body,
      password: hashPasswd,
    });
  } else {
    updateUser = await User.findByIdAndUpdate(_id, {
      ...req.body,
    });
  }

  res.status(200).json({
    email: updateUser.email,
    username: updateUser.username || "",
    gender: updateUser.gender || "",
    avatarURL: updateUser.avatarURL || "",
    waterNorma: updateUser.waterNorma,
    date: updateUser.date,
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
