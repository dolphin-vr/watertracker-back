import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
const genderList = ["woman", "man"];

const userSchema = new Schema(
  {
    username: {
      type: String,
      minLength: 3,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["woman", "man"],
    },
    avatarURL: String,
    token: {
      type: String,
      default: null,
    },
    waterNorma: { type: Number, min: 0, max: 15000, default: 0 },
    date: {
      type: String,
      required: [true, "Set registration date"],
    },
    verify: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export const SignUpSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp).messages({
    "any.required": "missing required field 'email'",
    "string.pattern.base": "'email' must be valid e-mail",
  }),
  password: Joi.string().required().min(8).max(48).messages({
    "any.required": "missing required field 'password'",
    "string.base": "'password' must be string",
  }),
  date: Joi.date().iso().required().messages({
    "any.required": `missing required "date" field`,
    "string.base": `"date" must be date`,
  }),
});

export const SignInSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp).messages({
    "any.required": "missing required field 'email'",
    "string.pattern.base": "'email' must be valid e-mail",
  }),
  password: Joi.string().required().min(8).max(48).messages({
    "any.required": "missing required field 'password'",
    "string.base": "'password' must be string",
  }),
});

export const RemindSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp).messages({
    "any.required": "missing required field 'email'",
    "string.pattern.base": "'email' must be valid e-mail",
  }),
});

export const VerifySchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp).messages({
    "any.required": "missing required field 'email'",
    "string.pattern.base": "'email' must be valid e-mail",
  }),
});

export const UpdateUserInfoSchema = Joi.object({
  username: Joi.string().min(3).messages({
    "string.base": "{#label} must be string",
  }),
  email: Joi.string().pattern(emailRegexp).messages({
    "string.pattern.base": "{#label} must be valid e-mail",
  }),
  password: Joi.string().min(8).max(48).messages({
    "string.base": "{#label} must be string",
  }),
  newPassword: Joi.string().min(8).max(48).messages({
    "string.base": "{#label} must be string",
  }),
  gender: Joi.string().valid(...genderList),
});

export const UpdateWaterNormaSchema = Joi.object({
  waterNorma: Joi.number().min(1).max(15000).required().messages({
    "any.required": "missing required {#label} field",
    "number.base": "{#label} must be number",
  }),
});

export default User;
