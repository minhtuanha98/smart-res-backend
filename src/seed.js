const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  try {
    const password = await bcrypt.hash("12345", 10);
    await prisma.user.create({
      data: {
        username: "resident3",
        email: "resident34@example.com",
        password,
        apartNumber: "A-101",
        phone: "1234567890",
        role: "resident",
        createdAt: new Date(),
        feedbacks: {
          create: [
            {
              title: "Welcome",
              content: "Welcome to the resident dashboard!",
              createdAt: new Date(),
            },
          ],
        },
      },
    });
    console.log("User created");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
