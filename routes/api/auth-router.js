import express from "express";
import authController from "../../controllers/auth-controller.js";
import { authentication, isEmptyBody, uploader } from "../../middlewares/index.js";
import bodyValidator from "../../decorators/bodyValidator.js";
import { SignInSchema, SignUpSchema } from "../../models/User.js";

const router = express.Router();

router.post("/signup", isEmptyBody, bodyValidator(SignUpSchema), authController.signup);
router.post("/signin", isEmptyBody, bodyValidator(SignInSchema), authController.signin);
router.post("/signout", authentication, authController.signout);
router.get("/refresh", authentication, authController.refresh);

export default router;
