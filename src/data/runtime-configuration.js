const path = require('path');

function requireStringEnvironmentVariable(environmentVariableName) {
  const environmentVariableValue = process.env[environmentVariableName];
  if (!environmentVariableValue || environmentVariableValue.trim() === '') {
    throw new Error(`${environmentVariableName} is required and cannot be empty.`);
  }
  return environmentVariableValue;
}

function parsePositiveInteger(environmentVariableName, fallbackValue) {
  const environmentVariableValue = process.env[environmentVariableName];
  if (!environmentVariableValue) return fallbackValue;
  const parsedInteger = Number.parseInt(environmentVariableValue, 10);
  if (!Number.isFinite(parsedInteger) || parsedInteger <= 0) {
    throw new Error(`${environmentVariableName} must be a positive integer.`);
  }
  return parsedInteger;
}

function createRuntimeConfiguration() {
  const deploymentsBaseDirectory = path.resolve(process.env.DEPLOYMENTS_BASE_DIRECTORY || './deployments');
  const idleShutdownHours = parsePositiveInteger('IDLE_SHUTDOWN_HOURS', 8);

  return {
    deploymentServerPort: parsePositiveInteger('PORT', 3000),
    deploymentAuthenticationKey: requireStringEnvironmentVariable('DEPLOYMENT_AUTHENTICATION_KEY'),
    deploymentsBaseDirectory,
    maximumUploadSizeInMegabytes: parsePositiveInteger('MAXIMUM_UPLOAD_SIZE_IN_MEGABYTES', 200),
    idleShutdownMilliseconds: idleShutdownHours * 60 * 60 * 1000,
    safeLoggingEnabled: process.env.SAFE_LOGGING_ENABLED !== 'false'
  };
}

module.exports = {
  createRuntimeConfiguration
};
