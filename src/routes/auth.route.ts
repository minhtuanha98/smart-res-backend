import { Router } from "express";
import { refreshTokenController } from "../controllers/auth.controller";
import { extractClientMeta } from "../middlewares/extractClientMeta.middleware";

const router = Router();
router.post("/refresh_token", extractClientMeta, refreshTokenController);

export default router;
