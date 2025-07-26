import userRepository from "../../repositories/user.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("userRepository.findByUsername", () => {
  beforeAll(async () => {
    // Tạo user test
    await prisma.user.create({
      data: {
        username: "admin",
        email: "testuser@example.com",
        password: "hashedpassword",
        role: "user",
        createdAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: "admin" } });
    await prisma.$disconnect();
  });

  it("should return user when username exists", async () => {
    const user = await userRepository.findByUsername("testuser");
    expect(user).not.toBeNull();
    expect(user).toHaveProperty("username", "testuser");
    expect(user).toHaveProperty("email", "testuser@example.com");
  });

  it("should return null when username does not exist", async () => {
    const user = await userRepository.findByUsername("notfound");
    expect(user).toBeNull();
  });
});
