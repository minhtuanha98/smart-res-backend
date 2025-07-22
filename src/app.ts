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
import { redisClient } from "./utils/redisClient";
import { extractClientMeta } from "./middlewares/extractClientMeta.middleware";
const cors = require("cors");

const swaggerDocument = YAML.load("./src/swagger.yaml");

export const app = express();
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(extractClientMeta);
app.use("/uploads", express.static("uploads"));
app.use("/api", routes);
app.use("/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    // Connect Redis
    await redisClient.connect();
    console.log("🚀 ~ Redis connected:", redisClient.isReady);

    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URL || "", {});
    console.log("Database connected successfully.");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Connection error:", error);
  }
};

startServer();
