import { controlWrapper } from '../decorators/index.js';
import Contact from '../models/Contact.js';
import { HttpError } from "../helpers/HttpError.js";

const getAll = async (req, res) => {
   const {_id: owner} = req.user;
   const {page=1, limit=10, ...searchParam} = req.query;
   const skip = (page-1)*limit;
   const query = {owner, ...searchParam};
   const result = await Contact.find(query, "-createdAt -updatedAt", {skip, limit}).populate("owner", "username email");
   const total = await Contact.countDocuments(query);
   res.json({result, total});
}

const getById = async (req, res, next) => {
   const {_id: owner} = req.user;
   const {id} = req.params;
   const result = await Contact.findOne({_id: id, owner}, "-createdAt -updatedAt").populate("owner", "username email");
   if (!result){
      next(new HttpError(404, `Contact with id=${req.params.id} not found`));
   } else{
   res.json(result);
   }
}

const add = async (req, res, next)=>{
   const result = await Contact.create({...req.body, owner: req.user._id});
   res.status(201).json(result);
}

const updateById = async (req, res, next)=>{
   const {_id: owner} = req.user;
   const {id} = req.params;
   const result = await Contact.findOneAndUpdate({_id: id, owner}, req.body);
   if (!result){
      next(new HttpError(404, `Contacts with id=${req.params.id} not found`));
   } else{
   res.json(result);
   };
}

const deleteById = async (req, res, next)=>{
   const {_id: owner} = req.user;
   const {id} = req.params;
   const result = await Contact.findByIdAndDelete({_id: id, owner});
   if (!result){
      next(new HttpError(404, `Contacts with id=${req.params.id} not found`));
   } else{
   res.json(result);
   };
}

const updateFavoriteById = async (req, res, next)=>{
   const result = await Contact.findByIdAndUpdate(req.params.id, req.body);
   if (!result){
      next(new HttpError(404, `Contacts with id=${req.params.id} not found`));
   } else{
   res.json(result);
   };
}

const deleteAll = async (req, res, next)=>{
   const result = await Contact.deleteMany();
   if (!result){
      next(new HttpError(404, "X3 what wrong"))
   }
   res.json(result)
}

export default {
   getAll: controlWrapper(getAll),
   getById: controlWrapper(getById),
   add: controlWrapper(add),
   updateById: controlWrapper(updateById),
   deleteById: controlWrapper(deleteById),
   updateFavoriteById: controlWrapper(updateFavoriteById),
   deleteAll: controlWrapper(deleteAll),
}