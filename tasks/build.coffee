module.exports = (grunt) ->
  grunt.registerTask 'build', [
    'clean'
    'coffeelint'
    'copy:build'
    'copy:html_files'
    'copy:ag_ui_kit'
    'copy:ag_data_browser'
    'copy:ag_data_configurator'
    'copy:bower_components'
    'copy:resources'
    'ngtemplates'
    'browserify'
    'sass:build'
  ]
