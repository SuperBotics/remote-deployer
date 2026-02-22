const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { validateDeploymentRequest } = require('../src/models/deployment-request-model');

test('validateDeploymentRequest rejects missing archive file', () => {
  const result = validateDeploymentRequest({
    uploadedArchiveFile: null,
    requestedTargetPath: 'application',
    deploymentsBaseDirectory: path.resolve('./deployments')
  });

  assert.equal(result.isValid, false);
});

test('validateDeploymentRequest resolves safe path', () => {
  const deploymentsBaseDirectory = path.resolve('./deployments');
  const result = validateDeploymentRequest({
    uploadedArchiveFile: { originalname: 'archive.zip' },
    requestedTargetPath: 'application',
    deploymentsBaseDirectory
  });

  assert.equal(result.isValid, true);
  assert.equal(result.resolvedTargetPath, path.join(deploymentsBaseDirectory, 'application'));
});
