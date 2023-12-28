import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const waterSchema = new Schema(
   {
      date: {
         type: String,
         required: [true, "Set date of record"],
      },
      time: {
         type: String,
         required: [true, "Set time of record"],
      },
      water: { type: Number, required: [true, "Set volume of water"], min: 10, max: 5000 },
      user: {
         type: Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },
   },
   { versionKey: false, timestamps: true }
); // , { collection: 'water' }

waterSchema.post("save", handleSaveError);

waterSchema.pre("findOneAndUpdate", preUpdate);

waterSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water", waterSchema, "water");

export const waterAddSchema = Joi.object({
    date: Joi.string().required().messages({
      "any.required": "missing required 'date' field",
      "string.base": "'date' must be date-string",
   }),
   time: Joi.string().required().messages({
    "any.required": "missing required 'time' field",
    "string.base": "'time' must be time-string",
  }),
   water: Joi.number().required().max(5000).messages({
    "any.required": "missing required 'water' field",
    "string.base": "'water' must be number",
   }),
});

export const waterUpdateSchema = Joi.object({
   date: Joi.string().messages({
     "string.base": "'date' must be date-string",
  }),
  time: Joi.string().required().messages({
   "any.required": "missing required 'time' field",
   "string.base": "'time' must be time-string",
 }),
  water: Joi.number().required().max(5000).messages({
   "any.required": "missing required 'water' field",
   "string.base": "'water' must be number",
  }),
});

export default Water;
