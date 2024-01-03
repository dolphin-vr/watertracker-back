import express from "express";
import userController from "../../controllers/user-controller.js";
import { authentication, isEmptyBody, uploader, } from "../../middlewares/index.js";
import { bodyValidator } from "../../decorators/index.js";
import { UpdateUserInfoSchema, UpdateWaterNormaSchema,} from "../../models/User.js";

const userRouter = express.Router();

userRouter.use(authentication);

userRouter.get("/info", userController.getUserInfo);

userRouter.patch("/avatar", uploader.single("avatar"), userController.userAvatar);

userRouter.patch("/info", isEmptyBody, bodyValidator(UpdateUserInfoSchema), userController.updateUserInfo);

userRouter.patch("/waterrate", isEmptyBody, bodyValidator(UpdateWaterNormaSchema), userController.updateWaterNorma);

export default userRouter;
