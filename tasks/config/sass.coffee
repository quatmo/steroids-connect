module.exports =
  options:
    trace: true
  build:
    files:
      "<%= dir.dist %>/style.css": "<%= dir.src %>/styles/style.sass"