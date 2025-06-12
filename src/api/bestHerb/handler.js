class BestHerbsHandler {
  constructor(service, validator, schemas) {
    this._service = service;
    this._validator = validator;
    this._schemas = schemas;

    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
  }

  async create(request, h) {
    const validatedPayload = this._validator.validate(
      this._schemas.BestHerbPayloadSchema,
      request.payload
    );

    const bestHerbId = await this._service.addBestHerb(validatedPayload);

    const response = h.response({
      status: "success",
      message: "BestHerb berhasil ditambahkan",
      data: {
        bestHerbId,
      },
    });
    response.code(201);
    return response;
  }

  async getAll(request) {
    let userUuid = null;

    if (request.auth?.credentials) {
      userUuid = request.auth.credentials.uuid;
    }

    const bestHerbs = await this._service.getAllBestHerbs(userUuid);

    return {
      status: "success",
      data: bestHerbs,
    };
  }

  async remove(request) {
    const validatedParams = this._validator.validate(
      this._schemas.BestHerbParamsSchema,
      request.params
    );

    await this._service.deleteBestHerb(validatedParams.id);

    return {
      status: "success",
      message: "BestHerb berhasil dihapus",
    };
  }
}

module.exports = BestHerbsHandler;
