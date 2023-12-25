import { controlWrapper } from '../decorators/index.js';
import Water from '../models/Water.js';
import { HttpError } from "../helpers/HttpError.js";
// import { dateISO, timeISO } from '../helpers/dates.js';

const getDaily = async (req, res)=>{
   const {_id: user} = req.user;
   const date = req.params.date;
   const query = {user, date};
   // console.log('query= ', query)
   const result = await Water.find(query, "-date -user -createdAt -updatedAt");
   // console.log(result);
   res.status(201).json({date, dailyPortions: result});
}

const addDoze = async (req, res, next)=>{
   // const date = dateISO(req.body.date);
   // const time = timeISO(req.body.date);
   const result = await Water.create({...req.body, user: req.user._id});
   // var localNow = new Date(result.date.getTime() -  (result.tzOffset * 60000));
   res.status(201).json({_id: result._id, date: result.date, time: result.time, water: result.water});
}

const generateMonth = async (req, res, next)=>{
   const mm = req.body.month;
   const firstDay = req.body.firstday;
   const lastDay = req.body.lastday;
   for (let day = firstDay; day <= lastDay; day++) {
      const dozen = Math.round(Math.random() * 17 + 1);
      const date = `2023-${mm.toString().padStart(2, 0)}-${day.toString().padStart(2, 0)}`;
      for (let doze = 1; doze < dozen; doze++) {
         const time = `${Math.round(Math.random() * 16 + 5)}:${Math.trunc(Math.random() * 12) * 5}`;
         const water = Math.trunc(Math.random() * 10 + 1) * 50;
         const result = await Water.create({date, time, water, user: req.user._id});
      }
   }
   res.status(201).json("Successfuly created");
}

// const getAll = async (req, res) => {
//    const {_id: owner} = req.user;
//    const {page=1, limit=10, ...searchParam} = req.query;
//    const skip = (page-1)*limit;
//    const query = {owner, ...searchParam};
//    const result = await Contact.find(query, "-createdAt -updatedAt", {skip, limit}).populate("owner", "username email");
//    const total = await Contact.countDocuments(query);
//    res.json({result, total});
// }

export default {
   getDaily: controlWrapper(getDaily),
   // getById: controlWrapper(getById),
   addDoze: controlWrapper(addDoze),
   // updateById: controlWrapper(updateById),
   // deleteById: controlWrapper(deleteById),
   generateMonth: controlWrapper(generateMonth),
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
