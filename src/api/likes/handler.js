class LikesHandler {
  constructor(likesService, validator, schemas) {
    this._likesService = likesService;
    this._validator = validator;
    this._schemas = schemas;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getUserLikesHandler = this.getUserLikesHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const userUuid = request.auth.credentials.uuid;
    const validatedPayload = this._validator.validate(
      this._schemas.PostLikePayloadSchema,
      request.payload
    );
    const { herbId, imageUrl } = validatedPayload;

    await this._likesService.addLike(userUuid, herbId, imageUrl);

    return h
      .response({
        status: "success",
        message: "Like berhasil ditambahkan",
      })
      .code(201);
  }

  async deleteLikeHandler(request, h) {
    const userUuid = request.auth.credentials.uuid;
    const validatedPayload = this._validator.validate(
      this._schemas.DeleteLikePayloadSchema,
      request.payload
    );
    const { herbId } = validatedPayload;

    await this._likesService.deleteLike(userUuid, herbId);

    return h
      .response({
        status: "success",
        message: "Like berhasil dihapus",
      })
      .code(200);
  }

  async getUserLikesHandler(request, h) {
    const { uuid: userUuid } = request.auth.credentials;
    const likes = await this._likesService.getUserLikes(userUuid);

    if (!likes.length) {
      return h.response({
        status: "success",
        message: "Belum ada tanaman yang disukai",
        data: [],
      }).code(200);
    }

    return h.response({
      status: "success",
      message: "Data like berhasil diambil",
      data: likes,
    }).code(200);
  }
}

module.exports = LikesHandler;
