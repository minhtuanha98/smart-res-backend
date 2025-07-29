import cleanupRepository from "../repositories/file.repository";
import logger from "../utils/logger";

/**
 * Asynchronously deletes all files in the image uploads directory.
 *
 * This function targets the "./uploads" folder and removes all files within it
 * by delegating the operation to the `cleanupRepository.deleteAllFilesInFolder` method.
 * If the image path is not defined, it logs an error message.
 *
 * @returns {Promise<void>} A promise that resolves when the cleanup operation is complete.
 */
const cleanupImages = async () => {
  const imgPath = "./uploads";

  if (!imgPath) {
    logger.error("[CLEANUP ERROR] Image path is not defined.");
  }
  try {
    await cleanupRepository.deleteAllFilesInFolder(imgPath);
  } catch (error) {
    logger.error("[CLEANUP ERROR] Failed to clean up images:", error);
    throw error;
  }
};

export default { cleanupImages };
