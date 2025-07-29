import cleanupService from "../../services/cleanup.service";
import cleanupRepository from "../../repositories/file.repository";
import logger from "../../utils/logger";

describe("cleanupService.cleanupImages", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call deleteAllFilesInFolder with the correct path", async () => {
    const spy = jest
      .spyOn(cleanupRepository, "deleteAllFilesInFolder")
      .mockResolvedValueOnce();
    await cleanupService.cleanupImages();
    expect(spy).toHaveBeenCalledWith("./uploads");
  });

  it("should log error and throw if deleteAllFilesInFolder throws", async () => {
    const error = new Error("delete failed");
    jest
      .spyOn(cleanupRepository, "deleteAllFilesInFolder")
      .mockRejectedValueOnce(error);
    const loggerSpy = jest.spyOn(logger, "error").mockImplementation();
    await expect(cleanupService.cleanupImages()).rejects.toThrow(
      "delete failed"
    );
    expect(loggerSpy).toHaveBeenCalledWith(
      "[CLEANUP ERROR] Failed to clean up images:",
      error
    );
  });
});
