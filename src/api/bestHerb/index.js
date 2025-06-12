// api/albums/index.js
const BestHerbsHandler = require("./handler");
const routes = require("./routes");
const BestHerbSchema = require("../../schema/bestHerbSchema");

module.exports = {
  name: "bestHerbs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new BestHerbsHandler(service, validator, BestHerbSchema);
    server.route(routes(handler));
  },
};
