// api/albums/index.js
const AlbumsHandler = require("./handler");
const routes = require("./routes");
const UserSchema = require("../../schema/usersSchema");

module.exports = {
  name: "users",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new AlbumsHandler(service, validator, UserSchema);
    server.route(routes(handler));
  },
};
