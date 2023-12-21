import { isValidObjectId } from "mongoose"
import { HttpError } from "../helpers/HttpError.js";

const isValidId = (req, res, next) =>{
   if (!isValidObjectId(req.params.id)){
      return next(new HttpError(404, `${req.params.id} isn't valid id`));
   }
   next();
}

export default isValidId;