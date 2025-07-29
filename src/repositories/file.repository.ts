import fs from "fs/promises";
import path from "path";
import logger from "../utils/logger";

/**
 * Deletes all files within the specified folder.
 *
 * Iterates through the contents of the given folder path and removes each file found.
 * Subdirectories and their contents are not affected.
 *
 * @param folderPath - The absolute or relative path to the folder whose files should be deleted.
 * @throws Will throw an error if reading the directory or deleting any file fails.
 */
const deleteAllFilesInFolder = async (folderPath: string) => {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.stat(filePath);
      if (stat.isFile()) {
        await fs.unlink(filePath);
      }
    }
  } catch (err) {
    logger.error(
      `[ERROR] Failed to delete files in folder: ${folderPath}`,
      err
    );
    throw err;
  }
};

export default {
  deleteAllFilesInFolder,
};
