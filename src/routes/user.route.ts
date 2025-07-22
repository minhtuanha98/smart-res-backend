import { Router } from "express";
import { loginSchema } from "../schemas/login.schema";
import { validateYupSchema } from "../middlewares/validate.middleware";
import { loginController } from "../controllers/user.controller";

const router = Router();

router.post("/login", validateYupSchema(loginSchema), loginController);

export default router;
