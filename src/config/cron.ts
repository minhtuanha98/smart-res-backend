import { CronJob } from "cron";
import cleanupService from "../services/cleanup.service";
import logger from "../utils/logger";

/**
 * Sets up scheduled cron jobs for the application.
 *
 * This function initializes and starts a cron job that runs daily at 23:00 (11:00 PM)
 * in the "Asia/Ho_Chi_Minh" timezone. The cron job executes an asynchronous cleanup
 * operation to remove unused images via the `cleanupService.cleanupImages()` method.
 * Any errors encountered during the cleanup process are logged using the application's logger.
 *
 * @remarks
 * The cron job is automatically started upon initialization.
 *
 * @example
 * setupCronJobs();
 */
const setupCronJobs = () => {
  // oxlint-disable-next-line no-unused-vars
  const job = new CronJob(
    "0 00 23 * * *",
    async () => {
      try {
        await cleanupService.cleanupImages();
      } catch (error) {
        logger.error(error);
      }
    },
    null, // onComplete
    true, // autoStart
    "Asia/Ho_Chi_Minh" // timezone
  );
};

export default setupCronJobs;
