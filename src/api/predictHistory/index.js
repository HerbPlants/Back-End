// api/albums/index.js
const PredictHistoryHandler = require("./handler");
const routes = require("./routes");
const PredictHistorySchema = require("../../schema/predictHistorySchema");

module.exports = {
  name: "predict",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new PredictHistoryHandler(service, validator, PredictHistorySchema);
    server.route(routes(handler));
  },
};
