const bcrypt = require("bcrypt");
const prisma = require("../../lib/prisma");
const InvariantError = require("../../exceptions/InvariantError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
  async addUser({ username, password, fullname, email }) {
    await this.verifyNewUsername(username, email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username: username,
        password: hashedPassword,
        full_name: fullname,
        email: email,
      },
    });

    return user.uuid;
  }

  async verifyNewUsername(username, email) {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      throw new InvariantError("Username atau email sudah digunakan");
    }
  }

  async verifyUserCredential(username, password) {
    const user = await prisma.users.findUnique({
      where: { username },
      select: { uuid: true, password: true },
    });

    if (!user) {
      throw new AuthenticationError("Username atau Password Salah");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AuthenticationError("Username atau Password Salah");
    }

    return user.uuid;
  }
}

module.exports = UsersService;
