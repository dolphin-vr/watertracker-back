import { controlWrapper } from '../decorators/index.js';
import Water from '../models/Water.js';
import { HttpError } from "../helpers/HttpError.js";
import User from '../models/User.js';
// import { dateISO, timeISO } from '../helpers/dates.js';

const addDoze = async (req, res, next)=>{
   // const date = dateISO(req.body.date);
   // const time = timeISO(req.body.date);
   const result = await Water.create({...req.body, user: req.user._id});
   // var localNow = new Date(result.date.getTime() -  (result.tzOffset * 60000));
   res.status(201).json({_id: result._id, date: result.date, time: result.time, water: result.water});
}

const getDaily = async (req, res)=>{
   const {_id: user} = req.user;
   const date = req.params.date;
   const query = {user, date};
   // console.log('query= ', query)
   const result = await Water.find(query, "-date -user -createdAt -updatedAt");
   // console.log(result);
   res.json({date, dailyPortions: result});
}

const getMonth = async (req, res)=>{
   const {_id: user} = req.user;
   const norma = req.user.waterNorma / 100 || 1;
   const month = req.params.date.slice(0, 7);
   const query = [
      { $match: {user, date: {$regex : month}} },
      { $group: { _id: "$date", daily: {$sum: "$water"}, doses: {$count: {}}} },
      { $replaceWith: { date: "$_id", percentage: { $round : { $divide: [ "$daily", norma]}}, doses: "$doses" } },
      {  $sort: {date: 1} }
   ];
   const result = await Water.aggregate(query);
   // console.log(result);
   res.json({daily: result, waterNorma: req.user.waterNorma});
}
// { $group: { _id: "$date", daily: { $divide: [ {$sum: "$water"}, 100 ] }, doses: {$count: {}}} },
   // console.log('query= ', query)
   // const result = await Water.find(query, "-createdAt -updatedAt");

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
   // console.log('firstdate== ', req.body.firstday);
   const firstDay = new Date(req.body.firstday);
   const lastDay = new Date(req.body.lastday);
   // console.log('firstDay== ', firstDay);
   // console.log('lastDay== ', lastDay);
   const regdate = await User.findByIdAndUpdate(req.user._id, { date: req.body.firstday });
   // let nextDay = firstDay;
   // nextDay.setDate(nextDay.getDate() + 1);
   for (let today = firstDay; today <= lastDay; today.setDate(today.getDate() + 1)) {
      const date = today.toISOString().slice(0, 10);
      const dozen = Math.round(Math.random() * 17 + 0);
      for (let doze = 0; doze < dozen; doze++) {
         const time = `${Math.round(Math.random() * 16 + 5)}:${Math.trunc(Math.random() * 12) * 5}`;
         const water = Math.trunc(Math.random() * 10 + 1) * 50;
         const result = await Water.create({date, time, water, user: req.user._id});
      }
   }
   // for (let day = firstDay; day <= lastDay; day++) {
   //    const dozen = Math.round(Math.random() * 17 + 0);
   //    const date = `2023-${mm.toString().padStart(2, 0)}-${day.toString().padStart(2, 0)}`;
   //    for (let doze = 1; doze < dozen; doze++) {
   //       const time = `${Math.round(Math.random() * 16 + 5)}:${Math.trunc(Math.random() * 12) * 5}`;
   //       const water = Math.trunc(Math.random() * 10 + 1) * 50;
   //       const result = await Water.create({date, time, water, user: req.user._id});
   //    }
   // }
   // console.log('firstDay== ', regdate);
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
   getMonth: controlWrapper(getMonth),
   addDoze: controlWrapper(addDoze),
   // updateById: controlWrapper(updateById),
   // deleteById: controlWrapper(deleteById),
   generateMonth: controlWrapper(generateMonth),
   generatePeriod: controlWrapper(generatePeriod),
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