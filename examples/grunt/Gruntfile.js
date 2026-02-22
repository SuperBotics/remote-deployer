module.exports = function(grunt) {
  grunt.initConfig({
    exec: {
      deployRemoteBuild: {
        command: [
          'curl -X POST ' + process.env.REMOTE_DEPLOYMENT_URL + '/deploy',
          '-H "x-deployment-key: ' + process.env.REMOTE_DEPLOYMENT_KEY + '"',
          '-F "path=' + process.env.REMOTE_DEPLOYMENT_PATH + '"',
          '-F "file=@dist/release.zip"'
        ].join(' ')
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('deploy', ['exec:deployRemoteBuild']);
};
