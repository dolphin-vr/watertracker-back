import express from "express";
import userController from "../../controllers/user-controller.js";
import { authentication, isEmptyBody, uploader } from "../../middlewares/index.js";
import bodyValidator from "../../decorators/bodyValidator.js";
import { SignInSchema, SignUpSchema, SubscriptionSchema, VerifySchema } from "../../models/User.js";

const router = express.Router();

router.post("/register", isEmptyBody, bodyValidator(SignUpSchema), userController.register);
router.post("/login", isEmptyBody, bodyValidator(SignInSchema), userController.login);
router.post("/signout", authentication, userController.signout);
router.get("/refresh", authentication, userController.refresh);
router.patch("/", authentication, isEmptyBody, bodyValidator(SubscriptionSchema), userController.subscriptionUpdate);
router.patch("/avatars", uploader.single("avatar"), authentication, userController.uploadAvatar);
router.get("/verify/:verificationToken", userController.emailVerification);
router.post("/verify", isEmptyBody, bodyValidator(VerifySchema), userController.emailResend);

export default router;
