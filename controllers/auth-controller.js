import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { controlWrapper } from "../decorators/index.js";
import User from "../models/User.js";
import { HttpError } from "../helpers/HttpError.js";
// import path from "path";

const { JWT_SECRET, BASE_URL } = process.env;
// const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res, next) => {
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (user) {
      return next(new HttpError(409, "Such e-mail already exist"));
   }
   const hashPasswd = await bcrypt.hash(password, 10);
   const newUser = await User.create({ ...req.body, password: hashPasswd });
   res.status(201).json({ email: newUser.email });
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
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "72h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token, user: { email: user.email, waterNorma: user.waterNorma } });
};

const signout = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.json("Signout successful");
};

const refresh = async (req, res, next) => {
  const { username, email, subscription } = req.user;
  res.json({ username, email, subscription });
};

export default {
  signup: controlWrapper(signup),
  signin: controlWrapper(signin),
  signout: controlWrapper(signout),
  refresh: controlWrapper(refresh),
};

// const emailVerification = async (req, res, next)=>{
//    const {verificationToken} = req.params;
//    const user = await User.findOne({verificationToken});
//    if (!user){
//       return next(new HttpError(404, 'User not found'))
//    }
//    await User.updateOne({verificationToken}, {verify: true, verificationToken: null});
//    res.status(200).json({message: 'Verification successful'});
// }

// const emailResend = async (req, res, next)=>{
//    const {email}=req.body;
//    const user=await User.findOne({email});
//    if (!user){
//       return next(new HttpError(404, 'User not found'))
//    }
//    if (user.verify){
//       return next(new HttpError(400, 'Verification has already been passed'))
//    }
//    const verificationEmail = {
//       to: email,
//       subject: "Verification email",
//       html: `<p></p><a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify your email</a><p></p>`,
//    };
//    await sendEmail(verificationEmail);
//    res.status(200).json({message: 'Verification email sent'});
// }
