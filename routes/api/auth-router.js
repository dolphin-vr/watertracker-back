import express from "express";
import authController from "../../controllers/auth-controller.js";
import { authentication, isEmptyBody } from "../../middlewares/index.js";
import bodyValidator from "../../decorators/bodyValidator.js";
import { RemindSchema, SignInSchema, SignUpSchema } from "../../models/User.js";

const router = express.Router();

router.post("/signup", isEmptyBody, bodyValidator(SignUpSchema), authController.signup);
router.post("/signin", isEmptyBody, bodyValidator(SignInSchema), authController.signin);
router.post("/signout", authentication, authController.signout);
router.get("/refresh", authentication, authController.refresh);
router.post("/remind", isEmptyBody, bodyValidator(RemindSchema), authController.remind);
router.patch("/reset", isEmptyBody, bodyValidator(SignUpSchema), authentication, authController.reset);

export default router;
