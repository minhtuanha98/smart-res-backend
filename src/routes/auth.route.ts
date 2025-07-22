import { Router } from "express";
import { refreshTokenController } from "../controllers/auth.controller";

const router = Router();
router.post("/refresh_token", refreshTokenController);

export default router;
