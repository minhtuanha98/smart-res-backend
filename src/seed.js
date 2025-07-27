const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  try {
    const users = [
      {
        username: "resident11",
        email: "user11@example.com",
        password: "12345",
        role: "resident",
      },
      {
        username: "resident12",
        email: "user12@example.com",
        password: "12345",
        role: "admin",
      },
      {
        username: "resident13",
        email: "user13@example.com",
        password: "12345",
        role: "resident",
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: hashedPassword,
          apartNumber: "A-101",
          phone: "1234567890",
          role: user.role,
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
    }

    console.log("Users created");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
