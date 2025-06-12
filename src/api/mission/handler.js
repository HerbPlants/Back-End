class MissionHandler {
  constructor(missionService, validator, schemas) {
    this._missionService = missionService;
    this._validator = validator;
    this._schemas = schemas;

    this.postCreateMissionHandler = this.postCreateMissionHandler.bind(this);
    this.getAllMissionsHandler = this.getAllMissionsHandler.bind(this);
    this.getUserDailyMissionsHandler = this.getUserDailyMissionsHandler.bind(this);
    this.incrementMissionProgressHandler = this.incrementMissionProgressHandler.bind(this);
    this.getAllUserMissionsHandler = this.getAllUserMissionsHandler.bind(this);
    this.getTodayMissionsHandler = this.getTodayMissionsHandler.bind(this);
  }

  async postCreateMissionHandler(request, h) {
    const payload = this._validator.validate(
      this._schemas.CreateMissionPayloadSchema,
      request.payload
    );

    const mission = await this._missionService.createMission(payload);

    return h
      .response({
        status: "success",
        message: "Misi berhasil dibuat",
        data: mission,
      })
      .code(201);
  }

  async getAllMissionsHandler(request, h) {
    const { type } = request.query;

    const missions = await this._missionService.getAllMissions(type);

    return h.response({
      status: "success",
      data: missions,
    });
  }

  async getUserDailyMissionsHandler(request, h) {
    const userUuid = request.auth.credentials.uuid;

    const missions = await this._missionService.getDailyMissionsForUser(userUuid);

    return h.response({
      status: "success",
      data: missions,
    });
  }

  async incrementMissionProgressHandler(request, h) {
    const userUuid = request.auth.credentials.uuid;
    const { missionId } = request.params;

    await this._missionService.incrementMissionProgress(userUuid, missionId, 1);

    return h.response({
      status: "success",
      message: "Progress misi berhasil ditambahkan",
    });
  }
  async getAllUserMissionsHandler(request, h) {
  const userUuid = request.auth.credentials.uuid;

  const missions = await this._missionService.getAllUserMissions(userUuid);

  return h.response({
    status: "success",
    data: missions,
  });
}

async getTodayMissionsHandler(request, h) {
  const userUuid = request.auth?.credentials?.uuid || null;

  const missions = await this._missionService.getTodayMissions(userUuid);

  return h.response({
    status: "success",
    data: missions,
  });
}

}

module.exports = MissionHandler;
