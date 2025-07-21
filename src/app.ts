import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const cors = require("cors");

const swaggerDocument = YAML.load("./src/swagger.yaml");
dotenv.config();

const app = express();
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    // Connect Redis

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
