import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const dateRegexp = /(\d{4})-(\d{2})-(\d{2})/;
const timeRegexp = /(\d{2}):(\d{2})/;
const waterSchema = new Schema(
   {
      date: {
         type: String,
         match: dateRegexp,
         required: [true, "Set date of record"],
      },
      time: {
         type: String,
         match: timeRegexp,
         required: [true, "Set time of record"],
      },
      water: {
         type: Number,
         required: [true, "Set volume of water"],
         min: 10, max: 5000
      },
      user: {
         type: Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },
   },
   { versionKey: false, timestamps: true }
);

waterSchema.post("save", handleSaveError);
waterSchema.pre("findOneAndUpdate", preUpdate);
waterSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water", waterSchema, "water");

export const waterAddSchema = Joi.object({
    date: Joi.string().pattern(dateRegexp).required().messages({
      "any.required": "missing required 'date' field",
      "string.base": "'date' must be date-string",
   }),
   time: Joi.string().pattern(timeRegexp).required().messages({
    "any.required": "missing required 'time' field",
    "string.base": "'time' must be time-string",
  }),
   water: Joi.number().required().max(5000).messages({
    "any.required": "missing required 'water' field",
    "string.base": "'water' must be number",
   }),
});

export const waterUpdateSchema = Joi.object({
  time: Joi.string().pattern(timeRegexp).required().messages({
   "any.required": "missing required 'time' field",
   "string.base": "'time' must be time-string",
 }),
  water: Joi.number().required().max(5000).messages({
   "any.required": "missing required 'water' field",
   "string.base": "'water' must be number",
  }),
});

export default Water;
