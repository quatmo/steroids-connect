module.exports =
  build:
    options:
      livereload: true
    files: [
      '<%= dir.src %>/**/*.sass'
      '<%= dir.templates %>/**/*.html'
      '<%= dir.src %>/**/*.coffee'
    ]
    tasks: 'build'