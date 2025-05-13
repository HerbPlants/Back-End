class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator, schemas) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this._schemas = schemas;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const validatedPayload = this._validator.validate(this._schemas.PostAuthenticationPayloadSchema, request.payload);

    const { username, password } = validatedPayload;
    const uuid = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ uuid });
    const refreshToken = this._tokenManager.generateRefreshToken({ uuid });

    await this._authenticationsService.addRefreshToken(refreshToken, uuid);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    const validatedPayload = this._validator.validate(this._schemas.PutAuthenticationPayloadSchema, request.payload);

    const { refreshToken } = validatedPayload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);

    const { uuid } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ uuid });

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    const validatedPayload = this._validator.validate(this._schemas.DeleteAuthenticationPayloadSchema, request.payload);

    const { refreshToken } = validatedPayload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
