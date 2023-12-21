import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const waterSchema = new Schema({
  date: {
    type: Date,
    required: [true, 'Set date-time of record'],
  },
  water:  { type: Number,
    required: [true, 'Set volume of water'],
    min: 10,
    max: 5000,
 },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }
 }, {versionKey: false, timestamps: true});

 waterSchema.post("save", handleSaveError);

 waterSchema.pre("findOneAndUpdate", preUpdate);
 
 waterSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water", waterSchema);

export const waterAddSchema = Joi.object({
  date: Joi.string().required().messages({
      "any.required": `missing required "date" field`,
      "string.base": `"date" must be date`,
  }),
  water: Joi.string().required().messages({
     "any.required": `missing required "water" field`,
     "string.base": `"water" must be text`,
 }),
  phone: Joi.string().required().messages({
     "any.required": `missing required "phone" field`,
     "string.base": `"phone" must be text`,
 }),
 favorite: Joi.boolean(),
 owner: Joi.object()
})

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
})


export default Contact;