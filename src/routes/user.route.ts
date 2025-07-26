import { Router } from "express";
import { loginSchema } from "../schemas/login.schema";
import { validateYupSchema } from "../middlewares/validate.middleware";
import {
  getAllUserController,
  loginController,
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../utils/multer";
import { feedbackSchema } from "../schemas/feedback.schema";
import {
  deleteFeedbackController,
  feedbackController,
  getFeedbacksController,
  updateFeedBackController,
} from "../controllers/feedback.controller";
import { logoutController } from "../controllers/logout.controller";

const router = Router();

router.post("/login", validateYupSchema(loginSchema), loginController);
router.post(
  "/feedback",
  protect("resident"),
  upload.single("image"),
  validateYupSchema(feedbackSchema),
  feedbackController
);

router.get(
  "/list/feedbacks",
  protect(["admin", "resident"]),
  getFeedbacksController
);

router.get("/list-user", protect("admin"), getAllUserController);

router.put(
  "/feedback/:feedbackId",
  protect(["admin", "resident"]),
  upload.single("image"),
  // validateYupSchema(feedbackSchema),
  updateFeedBackController
);

router.delete(
  "/feedback/:feedbackId",
  protect("admin"),
  deleteFeedbackController
);

router.post("/logout", logoutController);

export default router;
