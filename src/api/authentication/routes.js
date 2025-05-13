const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/authentications',
    handler: handler.postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/api/authentications',
    handler: handler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/api/authentications',
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = routes;