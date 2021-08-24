const uuid4 = require('uuid').v4;

const uniqueIdentifier = () => uuid4();

module.exports = { uniqueIdentifier };
