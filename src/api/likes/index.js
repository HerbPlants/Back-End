const LikesHandler = require("./handler");
const routes = require("./routes");
const LikeSchema = require("../../schema/likeSchema");

module.exports = {
  name: "likes",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new LikesHandler(service, validator, LikeSchema);
    server.route(routes(handler));
  },
};
