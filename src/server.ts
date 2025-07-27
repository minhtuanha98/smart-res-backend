import mongoose from "mongoose";
import { redisClient } from "./utils/redisClient";
import { app } from "./app";

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
