import { HttpError } from "../helpers/HttpError.js";

export const isValidDate = (req, res, next) =>{
	const regex = new RegExp(/(\d{4})-(\d{2})-(\d{2})/);
	if (!regex.test(req.params.date)){
		 return next(new HttpError(404, `${req.params.date} isn't valid date`));
	}
	next();
}

export const isValidMonth = (req, res, next) =>{
	const regex = new RegExp(/(\d{4})-(\d{2})/);
	if (!regex.test(req.params.date)){
		 return next(new HttpError(404, `${req.params.date} isn't valid month`));
	}
	next();
}
