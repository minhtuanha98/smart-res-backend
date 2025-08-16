import request from "supertest";
import { app } from "../../app";

describe("POST /api/users/login", () => {
  it("should return 200 and tokens for valid credentials", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "Admin", password: "1234567" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  it("should return 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "Admin", password: "wrong pass" });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 404 for not found route", async () => {
    const res = await request(app)
      .post("/api/users/notfound")
      .send({ username: "Admin`121212", password: "1234567" });
    expect(res.statusCode).toBe(404);
  });
});
