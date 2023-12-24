import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const waterSchema = new Schema(
   {
      date: {
         type: Date,
         required: [true, "Set date-time of record"],
      },
      tzOffset: {
         type: Number,
         default: 0,
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
  //  date: Joi.date().iso().required().messages({
    date: Joi.string().required().messages({
      "any.required": `missing required "date" field`,
      "string.base": `"date" must be date`,
   }),
   water: Joi.number().required().max(5000).messages({
      "any.required": `missing required "water" field`,
      "string.base": `"water" must be number`,
   }),
   owner: Joi.object(),
});

export const waterUpdateSchema = Joi.object({
   date: Joi.string().messages({
      "string.base": `"date" must be date`,
   }),
   water: Joi.string().messages({
      "string.base": `"water" must be text`,
   }),
   phone: Joi.string().messages({
      "string.base": `"phone" must be text`,
   }),
   favorite: Joi.boolean(),
});

export default Water;
