const Hapi = require('@hapi/hapi');
const config = require('config');
const { setDbConnection, bindRoutes } = require('./start-up');

const { port, environment } = config.get('context');

const server = Hapi.server({
  port,
});

const initializeServer = async () => {
  await server.start();
  console.log(
    `${process.env.npm_package_name} (${environment}): running on port ${port}`
  );
};

process.on('unhandledRejection', (err) => {
  console.log(err.message);

  process.exit(1);
});

setDbConnection();
bindRoutes(server);
initializeServer();
