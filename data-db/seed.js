const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const seed = async () => {
  let prisma;

  try {
    prisma = new PrismaClient();

    await prisma.$connect();
    console.log("✅ Terhubung ke database");

    const data = JSON.parse(
      fs.readFileSync("./data-db/hasil-scraping.json", "utf-8")
    );

    for (const herb of data) {
      await prisma.herb.upsert({
        where: { name: herb.name },
        update: {},
        create: herb,
      });
    }

    console.log("✅ Seeding selesai");
  } catch (err) {
    console.error("❌ Gagal insert atau koneksi DB:", err.message);
  } finally {
    if (prisma) await prisma.$disconnect();
  }
};

seed();
