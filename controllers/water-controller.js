import { controlWrapper } from '../decorators/index.js';
import Water from '../models/Water.js';
import { HttpError } from "../helpers/HttpError.js";
import User from '../models/User.js';
// import { dateISO, timeISO } from '../helpers/dates.js';

const addDoze = async (req, res, next)=>{
   const result = await Water.create({...req.body, user: req.user._id});
   res.status(201).json({_id: result._id, date: result.date, time: result.time, water: result.water});
}

const editDoze = async (req, res, next)=>{
   const {_id: user} = req.user;
   const {id} = req.params;
   // console.log(user, id)
   const result = await Water.findOneAndUpdate({_id: id, user}, req.body);
   // console.log(result)
      if (!result){
         next(new HttpError(404, `Drink with id=${req.params.id} not found`));
      } else{
      res.json({_id: result._id, date: result.date, time: result.time, water: result.water});
      };
}

const deleteDoze = async (req, res, next)=>{
   const {_id: user} = req.user;
   const {id} = req.params;
   // console.log(user, id)
   const result = await Water.findByIdAndDelete({_id: id, user});
   // console.log(result)
      if (!result){
         next(new HttpError(404, `Drink with id=${req.params.id} not found`));
      } else{
      res.json({message: "Delete success"});
      };
}

const getDaily = async (req, res)=>{
   const {_id: user} = req.user;
   const norma = req.user.waterNorma / 100 || 1;
   const date = req.params.date;
   // const query = {user, date};
   // const result = await Water.find(query, "-date -user -createdAt -updatedAt");
   const query = [
      { $match: {"date": date} },
      { $sort: {time: 1} },
      { $group: {
         _id: "$date", 
         dailyPortions: {$push: {id: "$_id", time: "$time", water: "$water"}}, 
         daily: {$sum: "$water"}, 
         doses: {$count: {}}}
      },
      { $replaceWith: { date: "$_id", percentage: { $round : { $divide: [ "$daily", norma]}}, doses: "$doses", dailyPortions: "$dailyPortions" } },
   ];
   const result = await Water.aggregate(query);
   // console.log(result)
   // res.json({date, dailyPortions: result});
   res.json(...result);
}
// db.books.aggregate([
//    // First Stage
//    {     $group : { _id : "$author", books: { $push: "$$ROOT" } }   },
//    // Second Stage
//    {     $addFields: { totalCopies : { $sum: "$books.copies" } } }
//  ])

const getMonth = async (req, res)=>{
   const {_id: user} = req.user;
   const norma = req.user.waterNorma / 100 || 1;
   const month = req.params.date.slice(0, 7);
   const query = [
      { $match: {user, date: {$regex : month}} },
      { $group: { _id: "$date", daily: {$sum: "$water"}, doses: {$count: {}}} },
      { $replaceWith: { date: "$_id", percentage: { $round : { $divide: [ "$daily", norma]}}, doses: "$doses" } },
      { $sort: {date: 1} }
   ];
   const result = await Water.aggregate(query);
   res.json({month: result, waterNorma: req.user.waterNorma});
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

const generatePeriod = async (req, res, next)=>{
   const firstDay = new Date(req.body.firstday);
   const lastDay = new Date(req.body.lastday);
   const regdate = await User.findByIdAndUpdate(req.user._id, { date: req.body.firstday });
   for (let today = firstDay; today <= lastDay; today.setDate(today.getDate() + 1)) {
      const date = today.toISOString().slice(0, 10);
      const dozen = Math.round(Math.random() * 17 + 0);
      for (let doze = 0; doze < dozen; doze++) {
         const time = `${Math.round(Math.random() * 16 + 5).toString().padStart(2, 0)}:${(Math.trunc(Math.random() * 12) * 5).toString().padStart(2, 0)}`;
         const water = Math.trunc(Math.random() * 10 + 1) * 50;
         const result = await Water.create({date, time, water, user: req.user._id});
      }
   }
   res.status(201).json("Successfuly created");
}

const deleteAll = async (req, res, next)=>{
   const result = await Water.deleteMany();
   if (!result){
      next(new HttpError(404, "X3 what wrong"))
   }
   res.json(result)
}

export default {
   getDaily: controlWrapper(getDaily),
   getMonth: controlWrapper(getMonth),
   addDoze: controlWrapper(addDoze),
   editDoze: controlWrapper(editDoze),
   deleteDoze: controlWrapper(deleteDoze),
   generateMonth: controlWrapper(generateMonth),
   generatePeriod: controlWrapper(generatePeriod),
   deleteAll: controlWrapper(deleteAll),
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

// db.players.aggregate( [
//    { $addFields:
//       {
//         isFound:
//             { $function:
//                {
//                   body: function(name) {
//                      return hex_md5(name) == "15b0a220baa16331e8d80e15367677ad"
//                   },
//                   args: [ "$name" ],
//                   lang: "js"
//                }
//             },
//          message:
//             { $function:
//                {
//                   body: function(name, scores) {
//                      let total = Array.sum(scores);
//                      return `Hello ${name}.  Your total score is ${total}.`
//                   },
//                   args: [ "$name", "$scores"],
//                   lang: "js"
//                }
//             }
//        }
//     }
// ] )