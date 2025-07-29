import request from "supertest";
import { app } from "../../app";

describe("Auth API", () => {
  let refreshToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "admin", password: "12345" });
    const cookies = res.headers["set-cookie"];
    refreshToken = Array.isArray(cookies)
      ? cookies
          .find((c) => c.includes("refresh_token"))
          ?.split(";")[0]
          ?.split("=")[1]
      : undefined;
  });

  it("should refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", `refresh_token=${refreshToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});
