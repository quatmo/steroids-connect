module.exports = (grunt) ->
  grunt.registerTask 'develop', [
    'connect:develop'
    'build'
    'watch:build'
  ]