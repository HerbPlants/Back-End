const uploadToSupabase = require("../../lib/supabaseUploader");

class PredictHistoryHandler {
  constructor(predictHistoryService, validator, schemas) {
    this._predictHistoryService = predictHistoryService;
    this._validator = validator;
    this._schemas = schemas;

    this.postPredictHandler = this.postPredictHandler.bind(this);
    this.getUserHistoryHandler = this.getUserHistoryHandler.bind(this);
  }

  async postPredictHandler(request, h) {
    const userUuid = request.auth.credentials.uuid;
    const validatedPayload = this._validator.validate(
      this._schemas.PostPredictHistoryPayloadSchema,
      request.payload
    );
    const { name, confidence } = validatedPayload;
    const file = request.payload.image;

    if (!file || !file.hapi || !file._data) {
      return h
        .response({ status: "fail", message: "File gambar tidak valid" })
        .code(400);
    }

    const herb = await this._predictHistoryService.getHerbByName(name);
    if (!herb) {
      return h
        .response({
          status: "fail",
          message: `Tanaman dengan nama "${name}" tidak ditemukan.`,
        })
        .code(404);
    }

    const filename = `${Date.now()}-${file.hapi.filename.replace(/\s/g, "_")}`;

    let imageUrl;
    try {
      imageUrl = await uploadToSupabase(file, filename);
    } catch (err) {
      console.error("Gagal upload ke Supabase:", err);
      return h
        .response({
          status: "error",
          message: "Gagal mengunggah gambar ke Supabase",
        })
        .code(500);
    }

    await this._predictHistoryService.addHistory({
      userUuid,
      herbId: herb.id,
      imageUrl,
      confidence: parseFloat(confidence),
    });

    return h
      .response({
        status: "success",
        message: "Riwayat prediksi berhasil disimpan",
        data: { imageUrl },
      })
      .code(201);
  }

  async getUserHistoryHandler(request, h) {
    const userUuid = request.auth.credentials.uuid;

    const history = await this._predictHistoryService.getUserHistory(userUuid);

    return h
      .response({
        status: "success",
        message: history.length
          ? "Riwayat prediksi berhasil diambil"
          : "Belum ada riwayat prediksi",
        data: history,
      })
      .code(200);
  }
}

module.exports = PredictHistoryHandler;
