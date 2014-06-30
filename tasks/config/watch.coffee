module.exports =
  build:
    files: [
      '<%= dir.templates %>/**/*.html'
      '<%= dir.src %>/**/*.coffee'
    ]
    tasks: 'build'