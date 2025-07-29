import request from "supertest";
import { app } from "../../app";

describe("Feedback API", () => {
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

  it("should create feedback", async () => {
    const res = await request(app)
      .post("/api/user/feedback")
      .set("Cookie", `access_token=${token}`)
      .send({ title: "Test", content: "Test content", apartNumber: "A1" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should get feedbacks", async () => {
    const res = await request(app)
      .get("/api/user/list/feedbacks")
      .set("Cookie", `access_token=${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("feedBacks");
  });

  // Thêm test update, delete nếu cần
});
