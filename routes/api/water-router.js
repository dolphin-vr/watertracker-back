import express from 'express';
import waterController from "../../controllers/water-controller.js";
import {authentication, isEmptyBody, isValidId} from '../../middlewares/index.js';
import {bodyValidator} from '../../decorators/index.js';
import { waterAddSchema, waterUpdateSchema } from '../../models/Water.js';

const router = express.Router();

router.use(authentication);

router.route('/')
   // .get(waterController.getAll)
   // .delete(waterController.deleteAll)
   .post(isEmptyBody, bodyValidator(waterAddSchema), waterController.addDoze);

// router.route('/:id')
//    .get(isValidId, waterController.getById)
//    .put(isValidId, isEmptyBody, bodyValidator(waterUpdateSchema), waterController.updateById)
//    .delete(isValidId, waterController.deleteById);

// router.route('/:id/favorite')
//    .patch(isValidId, isEmptyBody, bodyValidator(waterFavoriteSchema), waterController.updateFavoriteById);

// router.route('/all')
//    .delete(waterController.deleteAll);

export default router;
