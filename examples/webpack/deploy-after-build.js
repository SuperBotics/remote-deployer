const { execSync } = require('child_process');

function deployAfterBuild() {
  const command = [
    'curl -X POST ' + process.env.REMOTE_DEPLOYMENT_URL + '/deploy',
    '-H "x-deployment-key: ' + process.env.REMOTE_DEPLOYMENT_KEY + '"',
    '-F "path=' + process.env.REMOTE_DEPLOYMENT_PATH + '"',
    '-F "file=@dist/release.zip"'
  ].join(' ');

  execSync(command, { stdio: 'inherit' });
}

module.exports = deployAfterBuild;
