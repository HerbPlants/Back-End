const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const seed = async () => {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("✅ Terhubung ke database");

    const herbData = JSON.parse(
      fs.readFileSync("./data-db/data-herb.json", "utf-8")
    );

    for (const herb of herbData) {
      await prisma.herb.upsert({
        where: { name: herb.name },
        update: {},
        create: herb,
      });
    }
    console.log("✅ Seeding table `herb` selesai");

    const bestHerbData = JSON.parse(
      fs.readFileSync("./data-db/data-bestHerb.json", "utf-8")
    );

    for (const item of bestHerbData) {
      await prisma.bestHerb.upsert({
        where: { herbId: item.herbId },
        update: {
          name: item.name,
          khasiat: item.khasiat,
          image: item.image,
          updatedAt: new Date(item.updatedAt),
        },
        create: {
          herbId: item.herbId,
          name: item.name,
          khasiat: item.khasiat,
          image: item.image,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        },
      });
    }
    console.log("✅ Seeding table `bestHerb` selesai");

  } catch (err) {
    console.error("❌ Gagal insert:", err.message);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
