const path = require('path');

function validateDeploymentRequest({ uploadedArchiveFile, requestedTargetPath, deploymentsBaseDirectory }) {
  if (!uploadedArchiveFile) {
    return { isValid: false, message: 'file is required and must be a zip archive.' };
  }

  if (!requestedTargetPath || typeof requestedTargetPath !== 'string') {
    return { isValid: false, message: 'path is required and must be a string.' };
  }

  const resolvedTargetPath = path.resolve(deploymentsBaseDirectory, requestedTargetPath);
  const isPathInsideDeploymentsDirectory = resolvedTargetPath.startsWith(`${deploymentsBaseDirectory}${path.sep}`)
    || resolvedTargetPath === deploymentsBaseDirectory;

  if (!isPathInsideDeploymentsDirectory) {
    return { isValid: false, message: 'target path is outside the deployments base directory.' };
  }

  return {
    isValid: true,
    resolvedTargetPath
  };
}

module.exports = {
  validateDeploymentRequest
};
