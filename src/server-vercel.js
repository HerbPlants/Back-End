require("dotenv").config();
const Inert = require("@hapi/inert");
const path = require("path");

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const users = require("./api/user");
const authentications = require("./api/authentication");
const bestHerb = require("./api/bestHerb");
const likes = require("./api/likes");
const predict = require("./api/predictHistory");

const ClientError = require("./exceptions/ClientError");
const UsersService = require("./services/user/userService");
const AuthenticationsService = require("./services/authentication/authService");
const BestHerbsService = require("./services/bestHerb/bestHerbService");
const LikesService = require("./services/likes/likeService");
const PredictHistoryService = require("./services/predictHistory/predictHistoryService");

const TokenManager = require("./lib/tokenManager");
const validator = require("./lib/validator");

const createServer = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const bestHerbsService = new BestHerbsService();
  const likeService = new LikesService();
  const predictService = new PredictHistoryService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
      },
    },
  });

  await server.register(Inert);

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.ext("onPreAuth", (request, h) => {
    const token = request.state.accessToken;
    if (token && !request.headers.authorization) {
      request.headers.authorization = `Bearer ${token}`;
    }
    return h.continue;
  });

  server.auth.strategy("herbplants_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        uuid: artifacts.decoded.payload.uuid,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: validator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: validator,
      },
    },
    {
      plugin: bestHerb,
      options: {
        service: bestHerbsService,
        validator: validator,
      },
    },
    {
      plugin: likes,
      options: {
        service: likeService,
        validator: validator,
      },
    },
    {
      plugin: predict,
      options: {
        service: predictService,
        validator: validator,
      },
    },
  ]);

  server.route({
    method: "GET",
    path: "/predict/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "public/predict"),
        listing: false,
        index: false,
      },
    },
    options: {
      auth: false,
    },
  });

  server.route({
    method: "GET",
    path: "/debug-cookies",
    handler: (request, h) => {
      console.log("Cookies received at /debug-cookies:", request.state);
      return { cookies: request.state };
    },
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "HERBPLANTS API";
    },
  });

  server.route({
    method: "GET",
    path: "/api",
    handler: (request, h) => {
      return h
        .response({
          status: "success",
          message:
            "Selamat datang di Rest Full API menggunakan Framework Hapi, Postgrey, dan Prisma ORM untuk menunjang aplikasi capstone HerbPlants",
        })
        .code(200);
    },
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: response.message,
            details: response.details,
          })
          .code(response.statusCode);
      }

      if (!response.isServer) {
        return h.continue;
      }

      console.error(response);
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);
    }

    return h.continue;
  });

  return server;
  // console.log(`🚀 Server berjalan pada ${server.info.uri}`);
};

module.exports = createServer;
