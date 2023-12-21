import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Jimp from "jimp";
import gravatar from "gravatar.js";
import { controlWrapper } from "../decorators/index.js";
import User from "../models/User.js";
import { HttpError } from "../helpers/HttpError.js";
import path from "path";
import fs from "fs/promises";
import { avatarRenamer } from "../helpers/index.js";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res, next) => {
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (user) {
      return next(new HttpError(409, "Such e-mail already exist"));
   }
   const avatar = gravatar.url(email, { defaultIcon: "retro", size: 200, rating: "x" });
   const hashPasswd = await bcrypt.hash(password, 10);
   const verificationToken = nanoid();
   const newUser = await User.create({ ...req.body, password: hashPasswd, avatarURL: avatar, verificationToken });
   const verificationEmail = {
      to: email,
      subject: "Verification email",
      html: `<p></p><a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify your email</a><p></p>`,
   };
   await sendEmail(verificationEmail);
   res.status(201).json({ username: newUser.username, email: newUser.email, subscription: newUser.subscription });
};

const emailVerification = async (req, res, next) => {
   const { verificationToken } = req.params;
   const user = await User.findOne({ verificationToken });
   if (!user) {
      return next(new HttpError(404, "User not found"));
   }
   await User.updateOne({ verificationToken }, { verify: true, verificationToken: null });
   res.status(200).json({ message: "Verification successful" });
};

const emailResend = async (req, res, next) => {
   const { email } = req.body;
   const user = await User.findOne({ email });
   if (!user) {
      return next(new HttpError(404, "User not found"));
   }
   if (user.verify) {
      return next(new HttpError(400, "Verification has already been passed"));
   }
   const verificationEmail = {
      to: email,
      subject: "Verification email",
      html: `<p></p><a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify your email</a><p></p>`,
   };
   await sendEmail(verificationEmail);
   res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res, next) => {
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (!user) {
      return next(new HttpError(401, "E-mail or password invalid"));
   }
   if (!user.verify) {
      return next(new HttpError(401, "E-mail is not verified"));
   }
   const isPasswdOK = await bcrypt.compare(password, user.password);
   if (!isPasswdOK) {
      return next(new HttpError(401, "E-mail or password invalid"));
   }
   const payload = { id: user.id };
   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "72h" });
   await User.findByIdAndUpdate(user._id, { token });
   res.json({ token, user: { email: user.email, subscription: user.subscription } });
};

const signout = async (req, res, next) => {
   await User.findByIdAndUpdate(req.user._id, { token: "" });
   res.json("Signout successful");
};

const refresh = async (req, res, next) => {
   const { username, email, subscription } = req.user;
   res.json({ username, email, subscription });
};

const subscriptionUpdate = async (req, res, next) => {
   const result = await User.findByIdAndUpdate(req.user._id, req.body, { projection: "username email subscription" });
   res.json(result);
};

const uploadAvatar = async (req, res, next) => {
   const { path: tempPath, filename } = req.file;
   const { _id, username } = req.user;
   const newfilename = avatarRenamer(filename, username);
   const newPath = path.join(avatarPath, newfilename);
   try {
      (await Jimp.read(tempPath)).resize(250, 250).quality(75).write(newPath);
      await fs.unlink(tempPath);
   } catch (error) {
      error.message = "File operation error. Please try again later";
      return next(error);
   }
   const avatar = path.join("avatars", newfilename);
   const result = await User.findByIdAndUpdate(_id, { avatarURL: avatar }, { projection: "avatarURL" });
   res.json(result);
};

export default {
   signup: controlWrapper(signup),
   login: controlWrapper(login),
   signout: controlWrapper(signout),
   refresh: controlWrapper(refresh),
   subscriptionUpdate: controlWrapper(subscriptionUpdate),
   uploadAvatar: controlWrapper(uploadAvatar),
   emailVerification: controlWrapper(emailVerification),
   emailResend: controlWrapper(emailResend),
};
