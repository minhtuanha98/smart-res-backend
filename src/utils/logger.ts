import winston from "winston";
import path from "path";

const logDir = "logs";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "errors.log"),
      level: "error",
    }),
  ],
});

export default logger;
