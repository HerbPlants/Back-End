const routes = (handler) => [
  {
    method: "POST",
    path: "/api/predict-history",
    handler: handler.postPredictHandler,
    options: {
      auth: "herbplants_jwt",
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1024 * 1024 * 2,
      },
    },
  },
  {
    method: "GET",
    path: "/api/predict-history",
    handler: handler.getUserHistoryHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
];

module.exports = routes;
