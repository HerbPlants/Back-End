const routes = (handler) => [
  {
    method: "POST",
    path: "/api/missions",
    handler: handler.postCreateMissionHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
  {
    method: "GET",
    path: "/api/missions",
    handler: handler.getAllMissionsHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
  {
    method: "GET",
    path: "/api/missions/daily",
    handler: handler.getUserDailyMissionsHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
  {
    method: "POST",
    path: "/api/missions/{missionId}/progress",
    handler: handler.incrementMissionProgressHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
  {
    method: "GET",
    path: "/api/missions/user",
    handler: handler.getAllUserMissionsHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
  {
    method: "GET",
    path: "/api/missions/today",
    handler: handler.getTodayMissionsHandler,
    options: {
      auth: {
        mode: "optional",
        strategy: "herbplants_jwt",
      },
    },
  },
];

module.exports = routes;
