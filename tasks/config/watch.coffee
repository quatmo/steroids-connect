module.exports =
  build:
    options:
      livereload: true
    files: [
      '<%= dir.templates %>/**/*.html'
      '<%= dir.src %>/**/*.coffee'
    ]
    tasks: 'build'