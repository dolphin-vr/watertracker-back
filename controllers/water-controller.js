import { controlWrapper } from '../decorators/index.js';
import Water from '../models/Water.js';
import { HttpError } from "../helpers/HttpError.js";

const getDaily = async (req, res)=>{
   const {_id: user} = req.user;
   const today = req.body.date;
   
}

const addDoze = async (req, res, next)=>{
   console.log('body= ', req.body)
   const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
console.log('timeZone= ', timeZone);
const tzOffset = (new Date()).getTimezoneOffset();
console.log('timezoneOffset= ', tzOffset);
   const result = await Water.create({...req.body, tzOffset, user: req.user._id});
   console.log('result date= ', result.date.toLocaleString({ timeZone }))
   // var localNow = new Date(result.date.getTime() -  (result.tzOffset * 60000));
   res.status(201).json({_id: result._id, water: result.water, date: new Date(result.date.getTime() -  (result.tzOffset * 60000))});
}

const getAll = async (req, res) => {
   const {_id: owner} = req.user;
   const {page=1, limit=10, ...searchParam} = req.query;
   const skip = (page-1)*limit;
   const query = {owner, ...searchParam};
   const result = await Contact.find(query, "-createdAt -updatedAt", {skip, limit}).populate("owner", "username email");
   const total = await Contact.countDocuments(query);
   res.json({result, total});
}

export default {
   // getAll: controlWrapper(getAll),
   // getById: controlWrapper(getById),
   addDoze: controlWrapper(addDoze),
   // updateById: controlWrapper(updateById),
   // deleteById: controlWrapper(deleteById),
   // updateFavoriteById: controlWrapper(updateFavoriteById),
   // deleteAll: controlWrapper(deleteAll),
}



// const getById = async (req, res, next) => {
//    const {_id: owner} = req.user;
//    const {id} = req.params;
//    const result = await Contact.findOne({_id: id, owner}, "-createdAt -updatedAt").populate("owner", "username email");
//    if (!result){
//       next(new HttpError(404, `Contact with id=${req.params.id} not found`));
//    } else{
//    res.json(result);
//    }
// }

// const updateById = async (req, res, next)=>{
//    const {_id: owner} = req.user;
//    const {id} = req.params;
//    const result = await Contact.findOneAndUpdate({_id: id, owner}, req.body);
//    if (!result){
//       next(new HttpError(404, `Contacts with id=${req.params.id} not found`));
//    } else{
//    res.json(result);
//    };
// }

// const deleteById = async (req, res, next)=>{
//    const {_id: owner} = req.user;
//    const {id} = req.params;
//    const result = await Contact.findByIdAndDelete({_id: id, owner});
//    if (!result){
//       next(new HttpError(404, `Contacts with id=${req.params.id} not found`));
//    } else{
//    res.json(result);
//    };
// }

// const updateFavoriteById = async (req, res, next)=>{
//    const result = await Contact.findByIdAndUpdate(req.params.id, req.body);
//    if (!result){
//       next(new HttpError(404, `Contacts with id=${req.params.id} not found`));
//    } else{
//    res.json(result);
//    };
// }

// const deleteAll = async (req, res, next)=>{
//    const result = await Contact.deleteMany();
//    if (!result){
//       next(new HttpError(404, "X3 what wrong"))
//    }
//    res.json(result)
// }
