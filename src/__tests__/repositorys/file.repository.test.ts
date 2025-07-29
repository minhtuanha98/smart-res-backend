import fs from "fs/promises";
import path from "path";
import fileRepository from "../../repositories/file.repository";
import logger from "../../utils/logger";

describe("fileRepository.deleteAllFilesInFolder", () => {
  const folderPath = "./uploads";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete all files in the folder", async () => {
    const files = ["a.jpg", "b.png"];
    jest.spyOn(fs, "readdir").mockResolvedValueOnce(files as any);
    jest.spyOn(fs, "stat").mockResolvedValue({ isFile: () => true } as any);
    const unlinkSpy = jest.spyOn(fs, "unlink").mockResolvedValue();
    await fileRepository.deleteAllFilesInFolder(folderPath);
    expect(unlinkSpy).toHaveBeenCalledTimes(files.length);
    expect(unlinkSpy).toHaveBeenCalledWith(path.join(folderPath, files[0]));
    expect(unlinkSpy).toHaveBeenCalledWith(path.join(folderPath, files[1]));
  });

  it("should log error and throw if something fails", async () => {
    const error = new Error("fail");
    jest.spyOn(fs, "readdir").mockRejectedValueOnce(error);
    const loggerSpy = jest.spyOn(logger, "error").mockImplementation();
    await expect(
      fileRepository.deleteAllFilesInFolder(folderPath)
    ).rejects.toThrow("fail");
    expect(loggerSpy).toHaveBeenCalledWith(
      `[ERROR] Failed to delete files in folder: ${folderPath}`,
      error
    );
  });
});
