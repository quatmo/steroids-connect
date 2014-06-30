module.exports = (grunt) ->
  baseConfig = {
    dir:
      bower: 'bower_components'
      compile: 'compile'
      dist: 'dist'
      src: 'src'
      tasks: 'tasks'
      test: 'test'
      templates: 'src/templates'
      temp: 'temp'
  }

  require('load-grunt-config')(grunt, {
    configPath: "#{__dirname}/tasks/config"
    config: baseConfig
  })
  require('load-grunt-tasks')(grunt)

  grunt.loadTasks baseConfig.dir.tasks
