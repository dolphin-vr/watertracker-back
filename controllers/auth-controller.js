import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { controlWrapper } from "../decorators/index.js";
import User from "../models/User.js";
import { HttpError } from "../helpers/HttpError.js";

const { JWT_SECRET, BASE_URL } = process.env;

const makeToken = async (payload) => {
   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "720h" });
   await User.findByIdAndUpdate(payload.id, { token });
   return token
}

const signup = async (req, res, next) => {
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (user) {
      return next(new HttpError(409, "Such e-mail already exist"));
   }
   const hashPasswd = await bcrypt.hash(password, 10);
   const newUser = await User.create({ ...req.body, password: hashPasswd });
   const token = await makeToken({id: newUser._id});
   res.status(201).json({ email: newUser.email, date: newUser.date, token: token });
};

const signin = async (req, res, next) => {
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (!user) {
      return next(new HttpError(401, "E-mail or password invalid"));
   }
   const isPasswdOK = await bcrypt.compare(password, user.password);
   if (!isPasswdOK) {
      return next(new HttpError(401, "E-mail or password invalid"));
   }
   const token = await makeToken({id: user.id})
   res.json({ email: user.email, date: user.date, waterNorma: user.waterNorma, token: token, username: user.username, avatarURL: user.avatarURL, gender: user.gender });
};

const signout = async (req, res, next) => {
   await User.findByIdAndUpdate(req.user._id, { token: "" });
   res.json("Signout successful");
};

const refresh = async (req, res, next) => {
   res.json({ email: req.user.email, date: req.user.date, waterNorma: req.user.waterNorma, token: req.user.token, username: req.user.username, avatarURL: req.user.avatarURL, gender: req.user.gender });
};

export default {
   signup: controlWrapper(signup),
   signin: controlWrapper(signin),
   signout: controlWrapper(signout),
   refresh: controlWrapper(refresh),
};
