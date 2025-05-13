const InvariantError = require('../exceptions/InvariantError');

const validator = {
  validate: (schema, payload) => {
    const { error, value } = schema.validate(payload);
    if (error) {
      const errorMessages = error.details.map(detail => {
        return detail.message.replace(/\\/g, '');
      });

      throw new InvariantError('Data tidak valid', errorMessages);
    }
    return value;
  },
};

module.exports = validator;
