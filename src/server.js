const { createRuntimeConfiguration } = require('./data/runtime-configuration');
const { createIdleShutdownService } = require('./services/idle-shutdown-service');
const { createSafeLogger } = require('./utils/safe-logger');
const { createApplication } = require('./app');

function startServer() {
  const runtimeConfiguration = createRuntimeConfiguration();
  const safeLogger = createSafeLogger({ safeLoggingEnabled: runtimeConfiguration.safeLoggingEnabled });
  const idleShutdownService = createIdleShutdownService({
    idleShutdownMilliseconds: runtimeConfiguration.idleShutdownMilliseconds,
    onIdleShutdown: (idleDuration) => {
      safeLogger.info('idle shutdown triggered', { idleDuration });
      process.exit(0);
    }
  });

  const application = createApplication({ runtimeConfiguration, idleShutdownService, safeLogger });

  application.listen(runtimeConfiguration.deploymentServerPort, () => {
    safeLogger.info('deployment server started', {
      port: runtimeConfiguration.deploymentServerPort,
      deploymentsBaseDirectory: runtimeConfiguration.deploymentsBaseDirectory
    });
  });

  idleShutdownService.start();
}

if (require.main === module) {
  startServer();
}

module.exports = {
  startServer
};
