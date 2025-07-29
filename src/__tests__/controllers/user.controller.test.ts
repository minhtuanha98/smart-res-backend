import request from "supertest";
import { app } from "../../app";

describe("User API", () => {
  let token: string;

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
  });

  it("should get users", async () => {
    const res = await request(app)
      .get("/api/user/list-user")
      .set("Cookie", `access_token=${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
  });
});
