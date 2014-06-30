module.exports = (grunt) ->
  grunt.registerTask 'dev', [
    'connect:develop'
    'build'
    'watch:build'
  ]