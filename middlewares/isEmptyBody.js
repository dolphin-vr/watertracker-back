import { HttpError } from "../helpers/HttpError.js";

const isEmptyBody = async(req, res, next)=> {
    const keys = Object.keys(req.body);
    if(!keys.length) {
        return next(new HttpError(400, "Body can not be empty"))
    }
    next();
}

export default isEmptyBody;