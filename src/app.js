const express = require('express');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const { createAuthenticationMiddleware } = require('./middleware/authentication-middleware');
const { errorHandlerMiddleware } = require('./middleware/error-handler-middleware');
const { createDeploymentController } = require('./controllers/deployment-controller');
const { createOpenApiDocument } = require('./data/openapi-document');

function createApplication({ runtimeConfiguration, idleShutdownService, safeLogger }) {
  const application = express();
  const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: runtimeConfiguration.maximumUploadSizeInMegabytes * 1024 * 1024 }
  });

  application.use(express.json());
  application.use((request, response, next) => {
    idleShutdownService.registerActivity();
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  application.get('/health', (request, response) => {
    void request;
    response.status(200).json({ status: 'healthy' });
  });

  const openApiDocument = createOpenApiDocument({
    deploymentServerPort: runtimeConfiguration.deploymentServerPort
  });
  application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  application.get('/api-docs.json', (request, response) => {
    void request;
    response.status(200).json(openApiDocument);
  });

  application.post(
    '/deploy',
    createAuthenticationMiddleware({
      deploymentAuthenticationKey: runtimeConfiguration.deploymentAuthenticationKey
    }),
    uploadMiddleware.single('file'),
    createDeploymentController({
      deploymentsBaseDirectory: runtimeConfiguration.deploymentsBaseDirectory,
      safeLogger
    })
  );

  application.use((error, request, response, next) => {
    safeLogger.error('request processing failed', {
      route: request.path,
      method: request.method,
      errorMessage: error.message
    });
    errorHandlerMiddleware(error, request, response, next);
  });

  return application;
}

module.exports = {
  createApplication
};
