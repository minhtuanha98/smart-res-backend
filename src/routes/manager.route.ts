import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { feedbackSchema } from "../schemas/feedback.schema";
import { validateYupSchema } from "../middlewares/validate.middleware";
import { updateFeedBackController } from "../controllers/feedback.controller";

const router = Router();
// router.put(
//   "/feedbacks/:id",
//   protect("admin"),
//   validateYupSchema(feedbackSchema),
//   updateFeedBackController
// );

export default router;
