import request from "supertest";
import { app } from "../../app";

describe("Logout API", () => {
  let token: string;
  let refreshToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "admin", password: "12345" });
    const cookies = res.headers["set-cookie"];
    token = Array.isArray(cookies)
      ? cookies
          .find((c) => c.includes("access_token"))
          ?.split(";")[0]
          ?.split("=")[1]
      : undefined;
    refreshToken = Array.isArray(cookies)
      ? cookies
          .find((c) => c.includes("refresh_token"))
          ?.split(";")[0]
          ?.split("=")[1]
      : undefined;
  });

  it("should logout user", async () => {
    const res = await request(app)
      .post("/api/user/logout")
      .set("Cookie", [
        `access_token=${token}`,
        `refresh_token=${refreshToken}`,
      ]);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
