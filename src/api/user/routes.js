const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/register',
    handler: handler.postUserHandler,
  }
];

module.exports = routes;
