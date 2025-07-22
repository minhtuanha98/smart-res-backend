const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  try {
    const password = await bcrypt.hash("1234567", 10);
    await prisma.user.create({
      data: {
        username: "Admin",
        email: "admin1@example.com",
        password,
        role: "admin",
        createdAt: new Date(),
        feedbacks: {
          create: [
            {
              title: "Welcome",
              content: "Welcome to the admin dashboard!",
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
