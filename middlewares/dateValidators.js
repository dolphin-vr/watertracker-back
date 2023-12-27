import { HttpError } from "../helpers/HttpError.js";

export const isValidDate = (req, res, next) =>{
	// console.log('isValidDate= ', req.params.date)
	const regex = new RegExp(/(\d{4})-(\d{2})-(\d{2})/);
	// console.log('test= ', regex.test(req.params.date))
	if (!regex.test(req.params.date)){
		 return next(new HttpError(404, `${req.params.date} isn't valid date`));
	}
	next();
}

export const isValidMonth = (req, res, next) =>{
	// console.log('isValidDate= ', req.params.date)
	const regex = new RegExp(/(\d{4})-(\d{2})/);
	// console.log('test= ', regex.test(req.params.date))
	if (!regex.test(req.params.date)){
		 return next(new HttpError(404, `${req.params.date} isn't valid date`));
	}
	next();
}
