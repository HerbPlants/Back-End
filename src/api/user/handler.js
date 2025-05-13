class UsersHandler {
  constructor(service, validator, schemas) {
    this._service = service;
    this._validator = validator;
    this._schemas = schemas;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const validatedPayload = this._validator.validate(this._schemas.UserPayloadSchema, request.payload);

    const user_id = await this._service.addUser(validatedPayload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        user_id,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
