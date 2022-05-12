const mongoose = require('mongoose');
const config = require('config');

const { connection_uri: connectionUri } = config.get('db');

module.exports = async () => {
  await mongoose
    .connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.log(`Error connecting to MongoDB: ${err.message}`);
      process.exit(1);
    });
};
