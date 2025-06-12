const MissionHandler = require("./handler");
const routes = require("./routes");
const MissionSchema = require("../../schema/missionSchema");


module.exports = {
  name: "mission",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new MissionHandler(service, validator, MissionSchema);
    server.route(routes(handler));
  },
};
