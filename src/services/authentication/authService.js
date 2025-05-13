const prisma = require("../../lib/prisma");
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  async addRefreshToken(token, uuid_user) {
    const existingToken = await prisma.authentication.findUnique({
      where: { uuid_user },
    });

    if (existingToken) {
      await prisma.authentication.delete({
        where: { uuid_user },
      });
    }

    await prisma.authentication.create({
      data: {
        token,
        uuid_user,
      },
    });
  }

  async verifyRefreshToken(token) {
    const result = await prisma.authentication.findUnique({
      where: { token },
    });

    if (!result) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    await prisma.authentication.delete({
      where: { token },
    });
  }
}

module.exports = AuthenticationsService;
