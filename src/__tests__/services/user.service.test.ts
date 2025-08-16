import userService from "../../services/user.service";
jest.mock("../utils/redis", () => ({
  set: jest.fn().mockResolvedValue("OK"),
  get: jest.fn().mockResolvedValue(null),
  del: jest.fn().mockResolvedValue(1),
}));
describe("userService.loginUSer", () => {
  it("should return user for valid credentials", async () => {
    const result = await userService.loginUSer(
      { username: "Admin", password: "1234567" },
      { deviceId: "test", userAgent: "test", ip: "127.0.0.1" }
    );
    expect(result).toHaveProperty("_id");
    expect(result).toHaveProperty("username", "Admin");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("role", "admin");
    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("refreshToken");
  });

  it("should throw error for wrong credentials", async () => {
    await expect(
      userService.loginUSer(
        { username: "Admin", password: "wrong pass" },
        { deviceId: "test", userAgent: "test", ip: "127.0.0.1" }
      )
    ).rejects.toThrow();
  });

  it("should throw error for non-existent user", async () => {
    await expect(
      userService.loginUSer(
        { username: "notfound", password: "123456" },
        { deviceId: "test", userAgent: "test", ip: "127.0.0.1" }
      )
    ).rejects.toThrow();
  });

  it("should throw error for missing username", async () => {
    await expect(
      userService.loginUSer({ password: "1234567" } as any, {
        deviceId: "test",
        userAgent: "test",
        ip: "127.0.0.1",
      })
    ).rejects.toThrow();
  });

  it("should throw error for missing password", async () => {
    await expect(
      userService.loginUSer({ username: "Admin" } as any, {
        deviceId: "test",
        userAgent: "test",
        ip: "127.0.0.1",
      })
    ).rejects.toThrow();
  });
});
