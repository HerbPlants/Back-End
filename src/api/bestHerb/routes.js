const routes = (handler) => [
  { method: "POST", path: "/api/bestherbs", handler: handler.create },
  {
    method: "GET",
    path: "/api/bestherbs",
    handler: handler.getAll,
    options: {
      auth: {
        strategy: "herbplants_jwt",
        mode: "optional",
      },
    },
  },
  { method: "DELETE", path: "/api/bestherbs/{id}", handler: handler.remove },
];

module.exports = routes;
