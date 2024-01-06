import { controlWrapper } from '../decorators/index.js';
import Water from '../models/Water.js';
import { HttpError } from "../helpers/HttpError.js";
import User from '../models/User.js';

const dailyDrinks = async (user, date) => {  
   const norma = user.waterNorma;
   const query = [
      { $match: {user: user._id, "date": date} },
      { $sort: {time: 1} },
      { $group: {
         _id: "$date", 
         dailyPortions: {$push: {id: "$_id", time: "$time", water: "$water"}}, 
         daily: {$sum: "$water"}}
      },
      { $replaceWith: { dailyPortions: "$dailyPortions", 
            percentage: {$switch:
               {branches: [{case: {$eq: [norma, 0]}, then: -1}],
               default: { $round : { $divide: [{$multiply: [ "$daily", 100]}, norma]}}}
            }
      }},
   ];
   const result = await Water.aggregate(query);
   if (result.length) {
      return result[0]
   } else {
      return { percentage: 0, dailyPortions: []}
   }
}

const addDoze = async (req, res, next)=>{
   await Water.create({...req.body, user: req.user._id});
   const today = await dailyDrinks(req.user, req.body.date);
   res.status(201).json(today);
}

const editDoze = async (req, res, next)=>{
   const result = await Water.findOneAndUpdate({_id: req.params.id, user: req.user._id}, req.body);
      if (!result){
         next(new HttpError(404, `Drink with id=${req.params.id} not found`));
      } else{
         const today = await dailyDrinks(req.user, req.body.date);
         res.json(today);
      };
}

const deleteDoze = async (req, res, next)=>{
   const result = await Water.findOneAndDelete({_id: req.params.id, user: req.user._id});
      if (!result){
         next(new HttpError(404, `Drink with id=${req.params.id} not found`));
      } else{
         const today = await dailyDrinks(req.user, result.date);
         res.json(today);
      };
}

const getDaily = async (req, res)=>{
   const today = await dailyDrinks(req.user, req.params.date);
   res.json(today);
}

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
   generatePeriod: controlWrapper(generatePeriod),
   deleteAll: controlWrapper(deleteAll),
}
