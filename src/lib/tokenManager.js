const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => {
    const expiresIn = Number(process.env.ACCESS_TOKEN_AGE || 0.5 * 60);
    const exp = Math.floor(Date.now() / 1000) + expiresIn; 
    return Jwt.token.generate(
      { ...payload, exp }, // menambahkan exp pada payload
      process.env.ACCESS_TOKEN_KEY
    );
  },

  generateRefreshToken: (payload) => {
    const expiresIn = Number(process.env.REFRESH_TOKEN_AGE || 7 * 24 * 60 * 60); 
    const exp = Math.floor(Date.now() / 1000) + expiresIn;
    return Jwt.token.generate(
      { ...payload, exp }, // menambahkan exp pada payload
      process.env.REFRESH_TOKEN_KEY
    );
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;

      // Memeriksa apakah refresh token sudah kedaluwarsa
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new InvariantError('Refresh token sudah kedaluwarsa');
      }

      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
