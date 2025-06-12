const routes = (handler) => [
  {
    method: "POST",
    path: "/api/likes",
    handler: handler.postLikeHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/api/likes",
    handler: handler.deleteLikeHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
  {
    method: "GET",
    path: "/api/likes",
    handler: handler.getUserLikesHandler,
    options: {
      auth: "herbplants_jwt",
    },
  },
];

module.exports = routes;
