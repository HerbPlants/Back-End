const prisma = require("../../lib/prisma");
const InvariantError = require("../../exceptions/InvariantError");

class HerbService {
  async getHerbs() {
    return await prisma.herb.findMany();
  }

  async getHerbById(id) {
    const herb = await prisma.herb.findUnique({ where: { id: Number(id) } });
    if (!herb) throw new InvariantError("Herb tidak ditemukan");
    return herb;
  }

  async getHerbByName(name) {
    const herbInsensitive = await prisma.herb.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (!herbInsensitive) {
      throw new InvariantError("Herb tidak ditemukan");
    }
    return herbInsensitive;
  }

  async addHerb(payload) {
    const {
      name,
      nameLatin,
      nameLocal,
      khasiat,
      penyebaranTanaman,
      agroekologi,
    } = payload;

    const existing = await prisma.herb.findUnique({ where: { name } });
    if (existing) {
      throw new InvariantError("Nama herb sudah ada");
    }

    const herb = await prisma.herb.create({
      data: {
        name,
        nameLatin,
        nameLocal,
        khasiat,
        penyebaranTanaman,
        agroekologi,
      },
    });

    return herb.id;
  }

  async updateHerb(id, payload) {
    try {
      await this.getHerbById(id);

      await prisma.herb.update({
        where: { id: Number(id) },
        data: {
          ...payload,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      throw new InvariantError("Gagal memperbarui herb");
    }
  }

  async deleteHerb(id) {
    await this.getHerbById(id);

    await prisma.herb.delete({ where: { id: Number(id) } });
  }
}

module.exports = HerbService;
