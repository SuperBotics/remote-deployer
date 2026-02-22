function createOpenApiDocument({ deploymentServerPort }) {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Remote Deployment Utility API',
      version: '1.1.0',
      description: 'Secure deployment API for archive based deployments over a Cloudflare tunnel.'
    },
    servers: [{ url: `http://localhost:${deploymentServerPort}` }],
    paths: {
      '/health': {
        get: {
          summary: 'Returns service health',
          responses: {
            200: {
              description: 'Service is healthy'
            }
          }
        }
      },
      '/deploy': {
        post: {
          summary: 'Deploy archive contents to server',
          security: [{ DeploymentKeyHeader: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['file', 'path'],
                  properties: {
                    file: { type: 'string', format: 'binary' },
                    path: { type: 'string', example: 'my-application/current' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Deployment completed' },
            400: { description: 'Validation error' },
            401: { description: 'Authentication error' }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        DeploymentKeyHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-deployment-key'
        }
      }
    }
  };
}

module.exports = {
  createOpenApiDocument
};
