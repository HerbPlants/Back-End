const prisma = require("../../lib/prisma");
const InvariantError = require("../../exceptions/InvariantError");

class PredictHistoryService {
  async getUserHistory(userUuid) {
    const history = await prisma.predictionHistory.findMany({
      where: { userUuid },
      include: {
        herb: {
          select: {
            id: true,
            name: true,
            nameLatin: true,
            nameLocal: true,
            khasiat: true,
            penyebaranTanaman: true,
            agroekologi: true,
            BestHerb: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: { predictedAt: "desc" },
    });

    const herbIds = history.map((item) => item.herb.id);

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

    return history.map((item) => ({
      image: item.imageUrl || item.herb.BestHerb?.image || null,
      name: item.herb.name,
      khasiat: item.herb.khasiat,
      confidence: item.confidence,
      predictedAt: item.predictedAt,
      isLiked: likedSet.has(item.herb.id),
      herb: {
        herbId: item.herb.id,
        name: item.herb.name,
        nameLatin: item.herb.nameLatin,
        nameLocal: item.herb.nameLocal,
        khasiat: item.herb.khasiat,
        penyebaranTanaman: item.herb.penyebaranTanaman,
        agroekologi: item.herb.agroekologi,
      },
    }));
  }

  async addHistory({ userUuid, herbId, imageUrl, confidence }) {
    try {
      await prisma.predictionHistory.create({
        data: {
          userUuid,
          herbId,
          imageUrl,
          confidence,
        },
      });
    } catch (error) {
      if (
        error.code === "P2002" &&
        error.meta?.target?.includes("userUuid_herbId")
      ) {
        throw new InvariantError(
          "Riwayat prediksi sudah ada untuk tanaman ini."
        );
      }
      throw error;
    }
  }

  async getHerbByName(name) {
  const herb = await prisma.herb.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });

  return herb;
}
}

module.exports = PredictHistoryService;
