module.exports = (grunt) ->
  grunt.registerTask 'develop', [
    'build'
    'connect:develop'
    'watch:build'
  ]