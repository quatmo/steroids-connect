module.exports = (grunt) ->
  grunt.registerTask 'build', [
    'clean'
    'coffeelint'
    'copy:build'
    'ngtemplates'
    'browserify'
    'sass:build'
  ]
