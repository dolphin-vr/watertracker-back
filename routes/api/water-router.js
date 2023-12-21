import express from 'express';
import contactController from "../../controllers/contacts-controller.js";
import {authentication, isEmptyBody, isValidId} from '../../middlewares/index.js';
import {bodyValidator} from '../../decorators/index.js';
import { contactFavoriteSchema, contactsAddSchema, contactsUpdateSchema } from '../../models/Contact.js';

const router = express.Router();

router.use(authentication);

router.route('/')
   .get(contactController.getAll)
   .delete(contactController.deleteAll)
   .post(isEmptyBody, bodyValidator(contactsAddSchema), contactController.add);

router.route('/:id')
   .get(isValidId, contactController.getById)
   .put(isValidId, isEmptyBody, bodyValidator(contactsUpdateSchema), contactController.updateById)
   .delete(isValidId, contactController.deleteById);

router.route('/:id/favorite')
   .patch(isValidId, isEmptyBody, bodyValidator(contactFavoriteSchema), contactController.updateFavoriteById);

// router.route('/all')
//    .delete(contactController.deleteAll);

export default router;
