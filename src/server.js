require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const users = require("./api/user");
const authentications = require("./api/authentication");
const ClientError = require("./exceptions/ClientError");
const UsersService = require("./services/user/userService");
const AuthenticationsService = require("./services/authentication/authService");
const TokenManager = require("./lib/tokenManager");
const validator = require("./lib/validator");

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

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
        id: artifacts.decoded.payload.id,
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
  ]);

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

  await server.start();
  console.log(`🚀 Server berjalan pada ${server.info.uri}`);
};

init();
