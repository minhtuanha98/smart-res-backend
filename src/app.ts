import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes";
import authRoutes from "./routes/auth.route";
import { errorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { extractClientMeta } from "./middlewares/extractClientMeta.middleware";
const cors = require("cors");

const swaggerDocument = YAML.load("./src/swagger.yaml");

export const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(extractClientMeta);
app.use("/uploads", express.static("uploads"));
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);
