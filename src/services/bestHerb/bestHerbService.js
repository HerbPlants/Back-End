const prisma = require("../../lib/prisma");
const InvariantError = require("../../exceptions/InvariantError");

class BestHerbService {
  async addBestHerb(herbId) {
    const herb = await prisma.herb.findUnique({ where: { id: herbId } });
    if (!herb) throw new InvariantError("Herb tidak ditemukan");

    const existing = await prisma.bestHerb.findUnique({ where: { herbId } });
    if (existing) throw new InvariantError("Herb sudah masuk daftar bestHerb");

    const best = await prisma.bestHerb.create({
      data: {
        herbId,
        name: herb.name,
        khasiat: herb.khasiat,
      },
    });

    return best.id;
  }

  async getAllBestHerbs(userUuid = null) {
    const bestHerbs = await prisma.bestHerb.findMany({
      include: {
        herb: true,
      },
    });

    if (!userUuid) {
      return bestHerbs.map((herb) => ({
        ...herb,
        isLiked: false,
      }));
    }

    const herbIds = bestHerbs.map((item) => item.herbId);
    const likedHerbs = await prisma.like.findMany({
      where: {
        userUuid,
        herbId: { in: herbIds },
      },
      select: {
        herbId: true,
      },
    });

    const likedSet = new Set(likedHerbs.map((like) => like.herbId));

    return bestHerbs.map((item) => ({
      ...item,
      isLiked: likedSet.has(item.herbId),
    }));
  }

  async deleteBestHerb(id) {
    const existing = await prisma.bestHerb.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) throw new InvariantError("BestHerb tidak ditemukan");

    await prisma.bestHerb.delete({ where: { id: Number(id) } });
  }
}

module.exports = BestHerbService;
