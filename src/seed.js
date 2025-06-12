const { PrismaClient } = require("@prisma/client");
const fs =  require('fs');

const prisma = new PrismaClient();

const seed = async () => {
  try {
    const data = JSON.parse(fs.readFileSync('./src/hasil-scraping.json', 'utf-8'));

    for (const herb of data) {
      await prisma.herb.upsert({
        where: { name: herb.name },
        update: {},
        create: herb,
      });
    }

    console.log('Seeding selesai ✅');
  } catch (err) {
    console.error('Gagal insert:', err);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
