module.exports =
  build:
    expand: true
    cwd: '<%= dir.src %>/steroids/'
    src: '**/*.coffee'
    dest: '<%= dir.temp %>/steroids/'