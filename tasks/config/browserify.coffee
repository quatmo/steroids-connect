module.exports =
  options:
    transform: ["coffeeify"]
    browserifyOptions:
      extensions: [".coffee", ".js", ".shim"]
    bundleOptions:
      standalone: "steroids.connect"

  dist:
    src: "<%= dir.temp %>/steroids/connect.coffee"
    dest: "<%= dir.dist %>/steroids.connect.js"
