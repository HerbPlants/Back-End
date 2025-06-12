const prisma = require("../../lib/prisma");
const NotFoundError = require("../../exceptions/NotFoundError");

class LikesService {
  async addLike(userUuid, herbId, imageUrl) {
    const herb = await prisma.herb.findUnique({
      where: { id: herbId },
    });

    if (!herb) {
      throw new NotFoundError(`Tanaman dengan ID ${herbId} tidak ditemukan`);
    }

    const existingLike = await prisma.like.findUnique({
      where: { userUuid_herbId: { userUuid, herbId } },
    });

    if (existingLike) {
      throw new NotFoundError("Like sudah ada");
    }

    await prisma.like.create({
      data: {
        userUuid,
        herbId,
        imageUrl,
      },
    });
  }

  async deleteLike(userUuid, herbId) {
    const herb = await prisma.herb.findUnique({
      where: { id: herbId },
    });

    if (!herb) {
      throw new NotFoundError(`Tanaman dengan ID ${herbId} tidak ditemukan`);
    }

    const existingLike = await prisma.like.findUnique({
      where: { userUuid_herbId: { userUuid, herbId } },
    });

    if (!existingLike) {
      throw new NotFoundError("Like tidak ditemukan");
    }

    await prisma.like.delete({
      where: { userUuid_herbId: { userUuid, herbId } },
    });
  }

  async getUserLikes(userUuid) {
    const likes = await prisma.like.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    return likes.map((like) => ({
      image: like.imageUrl || like.herb.BestHerb?.image || null,
      name: like.herb.name,
      khasiat: like.herb.khasiat,
      createdAt: like.createdAt,
      isLiked: true,
      herb: {
        herbId: like.herb.id, 
        name: like.herb.name,
        nameLatin: like.herb.nameLatin,
        nameLocal: like.herb.nameLocal,
        khasiat: like.herb.khasiat,
        penyebaranTanaman: like.herb.penyebaranTanaman,
        agroekologi: like.herb.agroekologi,
      },
    }));
  }
}

module.exports = LikesService;
