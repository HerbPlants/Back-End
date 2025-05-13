const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message, details = null) {
    super(message);
    this.name = 'InvariantError';
    this.statusCode = 400;
    this.details = details ? details : [];
  }
}

module.exports = InvariantError;
