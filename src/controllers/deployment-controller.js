const { validateDeploymentRequest } = require('../models/deployment-request-model');
const { processDeployment } = require('../services/deployment-service');

function createDeploymentController({ deploymentsBaseDirectory, safeLogger }) {
  return async function deploymentController(request, response, next) {
    try {
      const validationResult = validateDeploymentRequest({
        uploadedArchiveFile: request.file,
        requestedTargetPath: request.body.path,
        deploymentsBaseDirectory
      });

      if (!validationResult.isValid) {
        return response.status(400).json({
          status: 'validation_error',
          message: validationResult.message
        });
      }

      const deploymentResult = await processDeployment({
        uploadedArchiveFileBuffer: request.file.buffer,
        resolvedTargetPath: validationResult.resolvedTargetPath
      });

      safeLogger.info('deployment completed', {
        resolvedTargetPath: validationResult.resolvedTargetPath,
        createdFilesCount: deploymentResult.createdFilePaths.length,
        overwrittenFilesCount: deploymentResult.overwrittenFilePaths.length,
        failedFilesCount: deploymentResult.failedFileWrites.length
      });

      return response.status(200).json({
        status: 'completed',
        created: deploymentResult.createdFilePaths,
        overwritten: deploymentResult.overwrittenFilePaths,
        failed: deploymentResult.failedFileWrites
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  createDeploymentController
};
