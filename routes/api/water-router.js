import express from 'express';
import waterController from "../../controllers/water-controller.js";
import {authentication, isEmptyBody, isValidDate, isValidId, isValidMonth} from '../../middlewares/index.js';
import {bodyValidator} from '../../decorators/index.js';
import { waterAddSchema, waterUpdateSchema } from '../../models/Water.js';

const router = express.Router();

router.use(authentication);

router.route('/genperiod').post(isEmptyBody, waterController.generatePeriod);
router.route('/killthemall').delete(waterController.deleteAll);

router.route('/')
   .post(isEmptyBody, bodyValidator(waterAddSchema), waterController.addDoze);
router.route('/:id')
   .put(isValidId, isEmptyBody, bodyValidator(waterUpdateSchema), waterController.editDoze)
   .delete(isValidId, waterController.deleteDoze);

router.route('/today/:date').get(isValidDate, waterController.getDaily);
router.route('/month/:date').get(isValidMonth, waterController.getMonth);

export default router;
